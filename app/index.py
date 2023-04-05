from dash import Dash, page_container, dcc, clientside_callback, ClientsideFunction, Output, Input, html
import dash_mantine_components as dmc
from MyListAnalyzerDash.route_setup import build_assets
import pathlib


class MainApplication:
    def __init__(self):
        self.__app = Dash(
            __name__,
            title="RahulARanger",
            update_title="Loading...",
            use_pages=True,
        )

        clientside_callback(
            ClientsideFunction(namespace='handleData', function_name='getTimezone'),
            Output("timezone", "data"),
            Input("timezone", "id")
        )  # called only once

        self.build()
        self.set_layout()

    def build(self):
        build_assets(self.app.server)
        self.app.renderer = (pathlib.Path(__file__).parent / "allocator.js").read_text()
        # since it is multi-page application, these scenarios are bound to happen
        # so, we supress those exceptions for now
        self.app.config.suppress_callback_exceptions = True

    @property
    def app(self):
        return self.__app

    def set_layout(self):
        # self.app.layout = dmc.MantineProvider(
        #     theme={"colorScheme": "dark", "fontFamily": "'segoe ui', 'Inter', sans-serif"},
        #     children=[
        #         page_container, dcc.Store(id="timezone"),
        #         dcc.Store(id="pipe", data="https://project-api-test.vercel.app/")
        #     ]
        # )
        self.app.layout = html.Div()


Application = MainApplication()
app = Application.app.server

if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()
    Application.app.run(port=6969, dev_tools_ui=True, debug=True, host="127.0.0.1")
