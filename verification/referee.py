from checkio.signals import ON_CONNECT
from checkio import api
from checkio.referees.io import CheckiOReferee

from tests import TESTS


cover = """
def cover(func, data):
    matr = tuple(tuple(row) for row in data[0])
    res = func(matr, tuple(data[1]), tuple(data[2]))
    return bool(res), str(res)
"""

def checker(answer, user_result):
    return answer == user_result[0], user_result[1]

api.add_listener(
    ON_CONNECT,

    CheckiOReferee(tests=TESTS,
                   function_name="can_pass",
                   cover_code={
                       'python-27': cover,  # or None
                       'python-3': cover
                   },
                   checker=checker
    ).on_ready)
