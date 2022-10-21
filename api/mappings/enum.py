from collections import namedtuple

main_app = namedtuple("MainApplication", [
    "loadApp", "loadingProps", "repo", "body", "me"
])(
    "__RahulARanger_app_load", {"variant": "bars", "color": "orange", "size": "xl"},
    "https://github.com/RahulARanger"
)