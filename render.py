import yaml

import jinja2

with open("info.yaml", "r") as f:
    info = yaml.safe_load(f)

templateEnv = jinja2.Environment(loader=jinja2.FileSystemLoader(searchpath="templates"))
template = templateEnv.get_template("index.html.j2")

with open("public/index.html", "w") as f:
    f.write(template.render(info=info))