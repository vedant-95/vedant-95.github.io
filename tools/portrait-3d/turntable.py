import numpy as np, gs, os
from PIL import Image
from multiprocessing import Pool
g=gs.load('raw.npy'); x=g['xyz']; cx,cz=-0.06,-0.01
m=(np.hypot(x[:,0]-cx,x[:,2]-cz)<0.35)&(x[:,1]>-0.5)&(x[:,1]<0.17)
g={k:(v[m] if isinstance(v,np.ndarray) else v) for k,v in g.items()}
N=60; W,H=400,460; SS=2; c=np.array([cx,-0.05,cz])
def frame(i):
    a=np.radians(180+360*i/N); cp=c+np.array([1.45*np.sin(a),-0.22,1.45*np.cos(a)])
    img,A=gs.render(g,cp,c,W*SS,H*SS,fov_y_deg=27)
    rgb=np.clip(img/np.maximum(A,1e-4)[...,None],0,1)
    rows=np.arange(H*SS)[:,None]/(H*SS); A=A*np.clip((0.97-rows)/0.2,0,1)
    rgba=np.dstack([rgb,A])
    im=Image.fromarray((rgba*255).clip(0,255).astype(np.uint8),'RGBA').resize((W,H),Image.LANCZOS)
    im.save(f'frames/{i:02d}.png'); return i
if __name__=='__main__':
    os.makedirs('frames',exist_ok=True)
    with Pool(8) as p: p.map(frame,range(N))
    fr=[Image.open(f'frames/{i:02d}.png') for i in range(N)]
    fr[0].save('../img/vedant-3d.webp',save_all=True,append_images=fr[1:],duration=80,loop=0,quality=82,method=6,lossless=False)
    print(os.path.getsize('../img/vedant-3d.webp'))
