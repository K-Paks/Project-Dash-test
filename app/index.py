from dash import Dash, page_container, dcc, clientside_callback, ClientsideFunction, Output, Input
import dash_mantine_components as dmc
from MyListAnalyzerDash.route_setup import build_assets, js_s


class MainApplication:
    def __init__(self):
        self.__app = Dash(
            __name__,
            title="RahulARanger",
            update_title="Loading...",
            use_pages=True,
            external_scripts=[
                "https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js",
                *js_s()
            ],
        )

        clientside_callback(
            ClientsideFunction(namespace='handleData', function_name='getTimezone'),
            Output("timezone", "data"),
            Input("timezone", "id")
        )  # called only once

        build_assets(self.app.server)
        self.set_layout()

    @property
    def app(self):
        return self.__app

    def set_layout(self):
        self.app.layout = dmc.MantineProvider(
            theme={"colorScheme": "dark", "fontFamily": "'segoe ui', 'Inter', sans-serif"},
            children=[
                page_container, dcc.Store(id="timezone"),
                dcc.Store(id="pipe", data="https://rahularanger-be-rahularanger.vercel.app")
            ]
        )


Application = MainApplication()
app = Application.app.server

if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()
    Application.app.run(port=6969, dev_tools_ui=True, debug=True, host="127.0.0.1")
