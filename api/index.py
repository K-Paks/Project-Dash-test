import logging
from dash import Dash, page_container, dcc
import dash_mantine_components as dmc

logging.getLogger('flask_cors').level = logging.DEBUG


class MainApplication:
    def __init__(self):
        self.__app = Dash(
            __name__,
            title="RahulARanger",
            update_title="Loading...",
            use_pages=True,
            external_scripts=[
                "https://unpkg.com/dash.nprogress@latest/dist/dash.nprogress.js",
                "https://unpkg.com/embla-carousel/embla-carousel.umd.js"
            ]
        )

        self.set_layout()

    @property
    def app(self):
        return self.__app

    def set_layout(self):
        self.app.layout = dmc.MantineProvider(
            theme={"colorScheme": "dark", "fontFamily": "'segoe ui', 'Inter', sans-serif"},
            children=[
                page_container
            ]
        )


Application = MainApplication()
app = Application.app.server

if __name__ == "__main__":
    Application.app.run(port=6969, dev_tools_ui=True, debug=True, host="127.0.0.1")
