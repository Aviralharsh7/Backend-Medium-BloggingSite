# Public & Views folder

Status: medium clone - functionality

- in public folder,
    - we define all the css, html, js, images, fonts which are static
    - these are directly given to client through URL, without any server side processing.
- in views folder,
    - files must be dynamically rendered
    - requires processing from template engines like pug, jade, etc
    - these files are usually part of server rendered views, where the server generates html based on data and sends it to client aka dynamically rendering