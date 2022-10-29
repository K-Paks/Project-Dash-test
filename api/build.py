import logging
import pathlib
import MyListAnalyzer
import shutil
import os


# NOTE: Import this file only once (we don't want to run duplicate tests)


logging.getLogger('flask_cors').level = logging.DEBUG
logging.basicConfig(level=logging.INFO, format='%(levelname)-s %(asctime)s :: %(message)s')


# BUILD TESTS
assert os.getenv("MAL_CLIENT_ID"), "We need client id for MAL"


def move_assets_and_pages(to: pathlib.Path, folds: pathlib.Path, for_sure=False, copy=False):
    if not for_sure:
        move_assets_and_pages(to / "assets", folds / "assets", True, copy)
        return move_assets_and_pages(to / "pages", folds / "pages", True, copy)

    if not folds.exists():
        return

    for fold in folds.iterdir():
        if not fold.exists():
            continue

        destination = to / fold.name
        logging.info("%s %s to %s", "Copying" if copy else "Moving", fold, destination)

        (
            destination.unlink() if not destination.is_dir() else shutil.rmtree(destination)
        ) if destination.exists() else ...

        (
            shutil.copytree(fold, to / fold.name) if fold.is_dir() else shutil.copy2(fold, to / fold.name)
        ) if copy else fold.rename(to / fold.name)


def assets_build(passive=True):
    to = pathlib.Path(__file__).parent

    for fold in (MyListAnalyzer,):
        logging.info("Adding Assets for the Module %s", fold)
        move_assets_and_pages(to, pathlib.Path(fold.__file__).parent, copy=passive)


if __name__ == "__main__":
    assets_build()
