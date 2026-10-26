import sys, os, glob, shutil
from playwright.sync_api import sync_playwright
url, name = sys.argv[1], sys.argv[2]
d = f"raw-{name}"; shutil.rmtree(d, ignore_errors=True)
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome")
    ctx = b.new_context(viewport={'width':1280,'height':800}, record_video_dir=d, record_video_size={'width':1280,'height':800})
    pg = ctx.new_page(); pg.goto(url, wait_until="load"); pg.wait_for_timeout(2500)
    h = pg.evaluate("document.body.scrollHeight") - 800
    for i in range(60):
        pg.evaluate(f"window.scrollTo(0,{int(h*min(1,(i+1)/60))})"); pg.wait_for_timeout(110)
    pg.wait_for_timeout(1200)
    ctx.close(); b.close()
v = glob.glob(f"{d}/*.webm")[0]
os.system(f"ffmpeg -y -loglevel error -ss 1.5 -i '{v}' -vf scale=640:-2,fps=24 -an -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart ../../img/builds/{name}.mp4")
print(name, os.path.getsize(f"../../img/builds/{name}.mp4"))
