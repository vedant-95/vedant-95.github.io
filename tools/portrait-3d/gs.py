import numpy as np
from numba import njit

C0 = 0.28209479177387814
C1 = 0.4886025119029199
C2 = [1.0925484305920792, -1.0925484305920792, 0.31539156525252005, -1.0925484305920792, 0.5462742152960396]
C3 = [-0.5900435899266435, 2.890611442640554, -0.4570457994644658, 0.3731763325901154,
      -0.4570457994644658, 1.445305721320277, -0.5900435899266435]

def load(path_npy):
    d = np.load(path_npy)
    xyz = np.stack([d['x'], d['y'], d['z']], 1).astype(np.float64)
    op = 1 / (1 + np.exp(-d['opacity'].astype(np.float64)))
    s = np.exp(np.stack([d['scale_0'], d['scale_1'], d['scale_2']], 1).astype(np.float64))
    q = np.stack([d['rot_0'], d['rot_1'], d['rot_2'], d['rot_3']], 1).astype(np.float64)
    q /= np.linalg.norm(q, axis=1, keepdims=True)
    dc = np.stack([d['f_dc_0'], d['f_dc_1'], d['f_dc_2']], 1).astype(np.float64)
    rest = np.stack([d[f'f_rest_{i}'] for i in range(45)], 1).astype(np.float64).reshape(-1, 3, 15).transpose(0, 2, 1)
    w, x, y, z = q.T
    Rq = np.stack([1-2*(y*y+z*z), 2*(x*y-w*z), 2*(x*z+w*y),
                   2*(x*y+w*z), 1-2*(x*x+z*z), 2*(y*z-w*x),
                   2*(x*z-w*y), 2*(y*z+w*x), 1-2*(x*x+y*y)], 1).reshape(-1, 3, 3)
    M = Rq * s[:, None, :]
    cov = M @ M.transpose(0, 2, 1)
    return dict(xyz=xyz, op=op, cov=cov, dc=dc, rest=rest, scale=s)

def sh_color(g, campos, deg=3):
    dirs = g['xyz'] - campos
    dirs /= np.linalg.norm(dirs, axis=1, keepdims=True)
    x, y, z = dirs[:, 0:1], dirs[:, 1:2], dirs[:, 2:3]
    r = g['rest']
    c = C0 * g['dc']
    if deg > 0:
        c = c - C1*y*r[:, 0] + C1*z*r[:, 1] - C1*x*r[:, 2]
    if deg > 1:
        xx, yy, zz, xy, yz, xz = x*x, y*y, z*z, x*y, y*z, x*z
        c = c + C2[0]*xy*r[:, 3] + C2[1]*yz*r[:, 4] + C2[2]*(2*zz-xx-yy)*r[:, 5] + C2[3]*xz*r[:, 6] + C2[4]*(xx-yy)*r[:, 7]
    if deg > 2:
        c = (c + C3[0]*y*(3*xx-yy)*r[:, 8] + C3[1]*xy*z*r[:, 9] + C3[2]*y*(4*zz-xx-yy)*r[:, 10]
             + C3[3]*z*(2*zz-3*xx-3*yy)*r[:, 11] + C3[4]*x*(4*zz-xx-yy)*r[:, 12]
             + C3[5]*z*(xx-yy)*r[:, 13] + C3[6]*x*(xx-3*yy)*r[:, 14])
    return np.clip(c + 0.5, 0, 1)

def look_at(campos, target, down=np.array([0., 1., 0.])):
    f = target - campos; f /= np.linalg.norm(f)
    r = np.cross(down, f); r /= np.linalg.norm(r)
    dn = np.cross(f, r)
    return np.stack([r, dn, f])

@njit(cache=True)
def _raster(order, u, v, ca, cb, cc, rad, rgb, al, W, H):
    img = np.zeros((H, W, 3)); T = np.ones((H, W))
    for k in range(order.shape[0]):
        i = order[k]
        x0 = max(0, int(u[i]-rad[i])); x1 = min(W-1, int(u[i]+rad[i])+1)
        y0 = max(0, int(v[i]-rad[i])); y1 = min(H-1, int(v[i]+rad[i])+1)
        for py in range(y0, y1+1):
            for px in range(x0, x1+1):
                t = T[py, px]
                if t < 1e-4:
                    continue
                dx = px + 0.5 - u[i]; dy = py + 0.5 - v[i]
                p = -0.5*(ca[i]*dx*dx + cc[i]*dy*dy) - cb[i]*dx*dy
                if p > 0:
                    continue
                a = min(0.99, al[i]*np.exp(p))
                if a < 1/255.:
                    continue
                for ch in range(3):
                    img[py, px, ch] += t*a*rgb[i, ch]
                T[py, px] = t*(1-a)
    return img, 1-T

def render(g, campos, target, W, H, fov_y_deg=30, deg=3):
    R = look_at(campos, target)
    fy = 0.5*H/np.tan(np.radians(fov_y_deg)/2); fx = fy
    t = (g['xyz'] - campos) @ R.T
    keep = t[:, 2] > 0.05
    t = t[keep]; cov = g['cov'][keep]
    tx, ty, tz = t.T
    J = np.zeros((len(t), 2, 3))
    J[:, 0, 0] = fx/tz; J[:, 0, 2] = -fx*tx/tz**2
    J[:, 1, 1] = fy/tz; J[:, 1, 2] = -fy*ty/tz**2
    JW = J @ R
    c2 = JW @ cov @ JW.transpose(0, 2, 1)
    a = c2[:, 0, 0] + 0.3; b = c2[:, 0, 1]; c = c2[:, 1, 1] + 0.3
    det = a*c - b*b
    ok = det > 0
    ca, cb, cc = c/det, -b/det, a/det
    mid = 0.5*(a+c); lam = mid + np.sqrt(np.maximum(0.1, mid*mid - det))
    rad = np.ceil(3*np.sqrt(lam))
    u = fx*tx/tz + W/2; v = fy*ty/tz + H/2
    ok &= (u+rad > 0) & (u-rad < W) & (v+rad > 0) & (v-rad < H)
    sub = {k: (val[keep] if isinstance(val, np.ndarray) and len(val) == len(keep) else val) for k, val in g.items()}
    rgb = sh_color(sub, campos, deg)
    idx = np.nonzero(ok)[0]
    order = idx[np.argsort(tz[idx])]
    img, A = _raster(order, u, v, ca, cb, cc, rad, rgb, sub['op'], W, H)
    return img, A
