import yaml

import jinja2


def main():
    with open("info.yaml", "r") as f:
        info = yaml.safe_load(f)

    templateEnv = jinja2.Environment(loader=jinja2.FileSystemLoader(searchpath="templates"))

    with open("public/index.html", "w") as f:
        f.write(templateEnv.get_template("index.html.j2").render(info=info))

    with open("public/assets/KamyarMirzavaziriResumeMR.html", "w") as f:
        f.write(templateEnv.get_template("resume.html.j2").render(info=info))


if __name__ == "__main__":
    main()
