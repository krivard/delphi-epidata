from flask import Blueprint

from .._config import AUTH
from .._query import execute_query, QueryBuilder
from .._validate import check_auth_token, extract_integers, extract_strings, require_all

# first argument is the endpoint name
bp = Blueprint("quidel", __name__)
alias = None


@bp.route("/", methods=("GET", "POST"))
def handle():
    check_auth_token(AUTH["quidel"])
    require_all("locations", "epiweeks")

    locations = extract_strings("locations")
    epiweeks = extract_integers("epiweeks")

    # build query
    q = QueryBuilder("quidel", "q")

    fields_string = ["location"]
    fields_int = ["epiweek"]
    fields_float = ["value"]
    q.set_fields(fields_string, fields_int, fields_float)

    q.set_order(epiweek=True, location=True)

    # build the filter
    q.where_strings("location", locations)
    q.where_integers("epiweek", epiweeks)

    # send query
    return execute_query(str(q), q.params, fields_string, fields_int, fields_float)
