import main.server as server
import flask

multiple_linear_regression = flask.Blueprint(
    'multiple_linear_regression', __name__)


@multiple_linear_regression.post('/multiple-linear-regression/new')
def create_new_multiple_linear_regression():
    server.new_multiple_linear_regression()

    return flask.jsonify(message='New MultipleLinearRegression created!'), 200


@multiple_linear_regression.get('/multiple-linear-regression/variables')
def get_variables():
    return flask.jsonify(variables=server.linear_regression.get_numeric_columns()), 200


@multiple_linear_regression.post('/multiple-linear-regression/run-model')
def run_model():
    data = flask.request.get_json()

    result = server.multiple_linear_regression.run_model(
        x_labels=data['xLabels'],
        y_label=data['yLabel'],
        test_size=data['testSize'],
        random_state=data['randomState']
    )

    return flask.jsonify(
        coeff=result['coeff'],
        intercept=result['intercept'],
        equation=result['equation'],
        mse=result['mse'],
        rSquaredAdj=result['rSquaredAdj'],
        rSquared=result['rSquared']
    ), 200


@multiple_linear_regression.post('/multiple-linear-regression/predict')
def predict():
    data = flask.request.get_json()

    values = data['values']

    return flask.jsonify(prediction=server.multiple_linear_regression.predict_value(values)), 200


@multiple_linear_regression.get('/multiple-linear-regression/differences/<int:count>')
def get_differences(count):
    return flask.jsonify(diffs=server.multiple_linear_regression.diff[0:count].to_dict(orient='split')), 200