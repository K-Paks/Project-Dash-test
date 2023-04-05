from dash import register_page, html
import logging
# import MyListAnalyzerDash.pages.user_view as user_view
# import MyListAnalyzerDash.pages.home_page as home_page

# logging.info("Added Pages %s, %s", user_view, home_page)

register_page(__name__, path="/", title="Home Page")


def layout():
    return html.Div('Holla here 2')

# https://api.myanimelist.net/v2/anime/season/2017/summer?limit=4&fields=media_type
