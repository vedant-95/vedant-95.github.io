import bpy, sys, os, math, glob
from mathutils import Vector
OUT = sys.argv[sys.argv.index('--') + 1]
ONLY = sys.argv[sys.argv.index('--') + 2:] 
SL = glob.glob(os.path.join(os.path.dirname(bpy.app.binary_path), '4.2', 'datafiles', 'studiolights', 'world', '*.exr'))
def lin(h):
    h = h.lstrip('#'); c = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    return [x / 12.92 if x <= 0.04045 else ((x + .055) / 1.055) ** 2.4 for x in c] + [1]
def reset(env='studio'):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 80; sc.cycles.use_denoising = True
    sc.render.resolution_x = sc.render.resolution_y = 360; sc.render.film_transparent = True
    sc.view_settings.view_transform = 'Standard'
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; nt = w.node_tree
    e = nt.nodes.new('ShaderNodeTexEnvironment'); e.image = bpy.data.images.load([p for p in SL if env in p][0])
    nt.links.new(e.outputs[0], nt.nodes['Background'].inputs[0]); nt.nodes['Background'].inputs[1].default_value = 1.2
    for loc, en, sz in [((-3, -4, 5), 700, 3), ((4, -2, 1), 250, 2), ((0, 4, 3), 400, 3)]:
        l = bpy.data.lights.new('l', 'AREA'); l.energy = en; l.size = sz
        o = bpy.data.objects.new('l', l); o.location = loc; sc.collection.objects.link(o)
        o.rotation_euler = (Vector((0, 0, 0)) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
def mat(color, metal=1.0, rough=0.2, coat=0.0, film=0):
    m = bpy.data.materials.new('m'); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = lin(color); b.inputs['Metallic'].default_value = metal
    b.inputs['Roughness'].default_value = rough; b.inputs['Coat Weight'].default_value = coat
    if film and 'Thin Film Thickness' in b.inputs: b.inputs['Thin Film Thickness'].default_value = film
    return m
def sel(o):
    bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
def add(kind, loc=(0, 0, 0), scale=(1, 1, 1), rot=(0, 0, 0), m=None, **kw):
    getattr(bpy.ops.mesh, 'primitive_' + kind + '_add')(location=loc, rotation=rot, **kw)
    o = bpy.context.active_object; o.scale = scale; bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if m: o.data.materials.append(m)
    bpy.ops.object.shade_smooth(); return o
def rbox(size, loc, bev, m, rot=(0, 0, 0)):
    o = add('cube', loc, [s / 2 for s in size], rot, m)
    b = o.modifiers.new('b', 'BEVEL'); b.width = bev; b.segments = 10; b.limit_method = 'NONE'; return o
def join(objs):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs: o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]; bpy.ops.object.join(); return objs[0]
def blob(objs, voxel=0.02, it=10):
    for o in objs:
        sel(o); bpy.ops.object.convert(target='MESH')
    o = join(objs); r = o.modifiers.new('r', 'REMESH'); r.mode = 'VOXEL'; r.voxel_size = voxel
    s = o.modifiers.new('s', 'SMOOTH'); s.iterations = it; s.factor = 0.7; sel(o); bpy.ops.object.shade_smooth(); return o
def shoot(name, view=(0.35, -1, 0.45), pad=1.25):
    sc = bpy.context.scene; dg = bpy.context.evaluated_depsgraph_get()
    pts = [o.matrix_world @ Vector(c) for o in sc.objects if o.type in ('MESH', 'CURVE', 'FONT', 'META') for c in o.evaluated_get(dg).bound_box]
    lo = Vector([min(p[i] for p in pts) for i in range(3)]); hi = Vector([max(p[i] for p in pts) for i in range(3)])
    ctr = (lo + hi) / 2; d = Vector(view).normalized()
    cam = bpy.data.cameras.new('c'); cam.type = 'ORTHO'; cam.ortho_scale = max(hi - lo) * pad
    c = bpy.data.objects.new('c', cam); sc.collection.objects.link(c); sc.camera = c
    c.location = ctr + d * 20; c.rotation_euler = (-d).to_track_quat('-Z', 'Y').to_euler()
    sc.render.filepath = os.path.join(OUT, name + '.png'); bpy.ops.render.render(write_still=True)

BLUE, LIME, PURPLE, CHROME = '#1a3cff', '#c8f500', '#8a6cff', '#e8e8ee'
def work():
    reset(); m = mat(BLUE, .9, .18, 1); ch = mat(CHROME, 1, .06)
    rbox((2.3, .8, 1.55), (0, 0, 0), .22, m)
    rbox((2.34, .84, .1), (0, 0, .25), .04, ch)
    rbox((.36, .9, .3), (0, 0, .25), .08, ch)
    add('torus', (0, 0, .78), (1, 1, 1.3), (math.pi / 2, 0, 0), ch, major_radius=.42, minor_radius=.09)
    shoot('work')
def builds():
    reset(); parts = [add('cylinder', (0, 0, 0), (1, 1, 1), (math.pi / 2, 0, 0), radius=.85, depth=.42, vertices=96)]
    for i in range(8):
        a = i * math.pi / 4
        parts.append(rbox((.42, .42, .42), (1.0 * math.cos(a), 0, 1.0 * math.sin(a)), .05, None, (0, -a, 0)))
    g = blob(parts, .02, 6)
    cut = add('cylinder', (0, 0, 0), (1, 1, 1), (math.pi / 2, 0, 0), radius=.36, depth=2); cut.hide_render = True; cut.display_type = 'WIRE'
    bo = g.modifiers.new('h', 'BOOLEAN'); bo.object = cut; bpy.ops.object.select_all(action='DESELECT')
    g.modifiers.move(len(g.modifiers) - 1, 0)
    g.data.materials.append(mat(LIME, .85, .16, 1)); shoot('builds')
def music():
    reset(); p = []
    for x, z in [(-.62, -.8), (.62, -.55)]:
        p.append(add('uv_sphere', (x, 0, z), (.42, .32, .3), (0, math.radians(25), 0), segments=48, ring_count=24))
        p.append(add('cylinder', (x + .36, 0, z + .8), (1, 1, 1), radius=.08, depth=1.6))
    p.append(rbox((1.42, .2, .3), (.36, 0, .98), .08, None, (0, math.radians(-10), 0)))
    o = blob(p, .018, 8); o.data.materials.append(mat(PURPLE, 1, .12, 1, 420)); shoot('music', (0.25, -1, 0.3))
def gaming():
    reset(); mb = bpy.data.metaballs.new('mb'); mb.resolution = .03; mb.render_resolution = .02; mb.threshold = .6
    ob = bpy.data.objects.new('ctrl', mb); bpy.context.scene.collection.objects.link(ob)
    for co, s, r in [((0, 0, .05), (1.0, .32, .42), 1.0), ((-.78, 0, -.45), (.32, .3, .5), .95), ((.78, 0, -.45), (.32, .3, .5), .95)]:
        e = mb.elements.new(); e.type = 'ELLIPSOID'; e.co = co; e.size_x, e.size_y, e.size_z = s; e.radius = r
    mb.materials.append(mat(CHROME, 1, .05)); sel(ob); bpy.ops.object.convert(target='MESH'); ob = bpy.context.active_object
    bpy.ops.object.shade_smooth()
    def surf(x, z):
        hit, loc, n, i = ob.ray_cast(Vector((x, -5, z)), Vector((0, 1, 0))); return loc if hit else Vector((x, -.4, z))
    for (x, z), col in zip([(.72, .32), (.72, -.08), (.52, .12), (.92, .12)], [LIME, BLUE, '#ff4fa3', PURPLE]):
        add('uv_sphere', surf(x, z), (.11, .11, .11), m=mat(col, .3, .15, 1), segments=32, ring_count=16)
    l = surf(-.7, .12); dm = mat('#2b2b33', .6, .25, 1)
    rbox((.46, .16, .15), l, .05, dm); rbox((.15, .16, .46), l, .05, dm)
    shoot('gaming', (0.15, -1, 0.55))
def markets():
    reset(); rbox((2.2, .25, 1.7), (0, 0, 0), .2, mat('#ffffff', 0, .15, 1))
    pts = [(-.85, -.55), (-.5, -.2), (-.2, -.38), (.15, .1), (.42, -.05), (.78, .45)]
    cu = bpy.data.curves.new('c', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = .075; cu.bevel_resolution = 6
    sp = cu.splines.new('POLY'); sp.points.add(len(pts) - 1)
    for i, (x, z) in enumerate(pts): sp.points[i].co = (x, -.2, z, 1)
    co = bpy.data.objects.new('line', cu); bpy.context.scene.collection.objects.link(co); g = mat('#13c26b', .8, .15, 1); cu.materials.append(g)
    for x, z in pts:
        add('uv_sphere', (x, -.2, z), (.075, .075, .075), m=g)
    a = Vector((.78 - .42, 0, .45 + .05)).normalized()
    cone = add('cone', (.78 + a.x * .12, -.2, .45 + a.z * .12), m=g, radius1=.2, depth=.32, vertices=48)
    cone.rotation_euler = a.to_track_quat('Z', 'Y').to_euler()
    for i, h in enumerate([.3, .5, .4, .75]):
        rbox((.16, .1, h), (-.6 + i * .42, -.1, -.68 + h / 2), .05, mat(BLUE, .6, .2, 1))
    shoot('markets', (0.25, -1, 0.3))
def resume():
    reset(); m = mat('#4f9dff', .35, .14, 1); w = mat('#ffffff', 0, .2, 1)
    body = rbox((1.5, .16, 1.9), (0, 0, 0), .07, m)
    cut = add('cube', (.75, 0, .95), (.32, .5, .32), (0, math.radians(45), 0)); cut.hide_render = True; cut.display_type = 'WIRE'
    bo = body.modifiers.new('cut', 'BOOLEAN'); bo.object = cut; body.modifiers.move(1, 0)
    fold = add('cone', (.62, -.06, .82), (1, .35, 1), (math.pi / 2, 0, math.radians(45)), m, radius1=.3, depth=.12, vertices=3)
    for i, ww in enumerate([.95, .95, .95, .6]):
        rbox((ww, .08, .1), (-.75 + .15 + ww / 2, -.09, .35 - i * .28), .04, w)
    shoot('resume', (0.3, -1, 0.3))
def wtc():
    reset(); g = mat('#34c759', .2, .14, 1)
    p = [rbox((2, .5, 1.4), (0, 0, 0), .45, None)]
    p.append(add('cone', (-.75, 0, -.72), (1, 1, 1), (0, math.radians(150), 0), radius1=.28, depth=.55, vertices=32))
    o = blob(p, .02, 8); o.data.materials.append(g)
    cu = bpy.data.curves.new('t', 'FONT'); cu.body = '$?'; cu.align_x = 'CENTER'; cu.align_y = 'CENTER'; cu.size = 1.0
    cu.extrude = .06; cu.bevel_depth = .02; t = bpy.data.objects.new('t', cu); t.location = (0, -.3, 0); t.rotation_euler = (math.pi / 2, 0, 0)
    bpy.context.scene.collection.objects.link(t); cu.materials.append(mat('#ffffff', 0, .2, 1))
    shoot('wtc', (0.25, -1, 0.3))
def builds():
    import bmesh
    reset(); me = bpy.data.meshes.new('g'); bm = bmesh.new(); n = 10; p = 2 * math.pi / n
    def ring(rads, fr):
        out = []
        for i in range(n):
            for f, rad in zip(fr, rads):
                a = i * p + f * p; out.append(bm.verts.new((rad * math.cos(a), 0, rad * math.sin(a))))
        return out
    fr = (-.25, -.12, .12, .25)
    o = ring((.78, 1.0, 1.0, .78), fr); inn = ring((.32,) * 4, fr); k = len(o)
    for i in range(k): bm.faces.new((o[i], o[(i + 1) % k], inn[(i + 1) % k], inn[i]))
    bm.to_mesh(me); g = bpy.data.objects.new('gear', me); bpy.context.scene.collection.objects.link(g)
    so = g.modifiers.new('s', 'SOLIDIFY'); so.thickness = .38; so.offset = 0
    b = g.modifiers.new('b', 'BEVEL'); b.width = .07; b.segments = 6; b.limit_method = 'ANGLE'
    g.modifiers.new('w', 'WEIGHTED_NORMAL'); sel(g); bpy.ops.object.shade_smooth()
    g.data.materials.append(mat('#d4ff1a', .6, .14, 1)); shoot('builds', (0.3, -1, 0.35))
def gaming():
    reset(); p = [rbox((2.0, .7, .95), (0, 0, .1), .42, None)]
    for s in (-1, 1):
        p.append(add('uv_sphere', (s * .72, 0, -.38), (.42, .34, .62), (0, -s * math.radians(25), 0), segments=48, ring_count=24))
    ob = blob(p, .02, 10); ob.data.materials.append(mat(CHROME, 1, .05)); sel(ob); bpy.ops.object.convert(target='MESH'); ob = bpy.context.active_object
    def surf(x, z):
        hit, loc, n, i = ob.ray_cast(Vector((x, -5, z)), Vector((0, 1, 0))); return loc if hit else Vector((x, -.35, z))
    for (x, z), col in zip([(.7, .36), (.7, -.02), (.51, .17), (.89, .17)], [LIME, BLUE, '#ff4fa3', PURPLE]):
        add('uv_sphere', surf(x, z), (.1, .1, .1), m=mat(col, .3, .15, 1), segments=32, ring_count=16)
    l = surf(-.65, .17); dm = mat('#2b2b33', .6, .25, 1)
    rbox((.44, .14, .14), l, .05, dm); rbox((.14, .14, .44), l, .05, dm)
    shoot('gaming', (0.15, -1, 0.5))
_music = music
def music():
    global PURPLE
    PURPLE, old = '#9b7bff', PURPLE; _music(); PURPLE = old
for f in [work, builds, music, gaming, markets, resume, wtc]:
    if ONLY and f.__name__ not in ONLY: continue
    try: f()
    except Exception as ex: print('FAIL', f.__name__, repr(ex))
