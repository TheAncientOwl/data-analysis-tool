import flask

import main.app as app

data_view = flask.Blueprint('data_view', __name__)


# >> Get rows count
@data_view.get('/data/rows-count')
def rows_count():
    return flask.jsonify(rowscount=app.dataFrame.shape[0]), 200


# >> Get rows in range [start:end) ~ start inclusive, end exclusive.
@data_view.get('/data/rows-between/<int:start>/<int:end>')
def rows_between(start, end):
    if end < start:
        temp = end
        end = start
        start = temp

    start = max(0, start)
    end = min(app.dataFrame.shape[0], end)

    requestedDf = app.dataFrame[start:end]

    missingValues = True if app.dataFrame.isnull().sum().sum() > 0 else False

    resultMap = {
        'labels': list(requestedDf.columns),
        'totalRows': app.dataFrame.shape[0],
        'rows': requestedDf.to_numpy().tolist(),
        'missingValues': missingValues
    }

    return flask.jsonify(dataframe=resultMap), 200


# >> Get page.
# @param pageIndex -> requested page index
# @param pageSize  -> size of a page
@data_view.get('/data/page/<int:pageIndex>/page-size/<int:pageSize>')
def get_page(pageIndex, pageSize):
    rowsCount = app.dataFrame.shape[0]
    pagesCount = rowsCount / pageSize

    startIndex = pageIndex * pageSize
    endIndex = startIndex + pageSize

    return rows_between(startIndex, endIndex)
