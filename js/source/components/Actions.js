import React from 'react';
import PropTypes from 'prop-types';

const Actions = props =>
    <div className="Actions">
        <span
            tabIndex="0"
            className="ActionsInfo"
            title="More info"
            onClick={props.onAction.bind(null, 'info')}>&#8505;</span>
        <span
            tabIndex="0"
            className="ActionsEdit"
            title="Edit"
            onClick={props.onAction.bind(null, 'edit')}>&#10000;</span>
        <span
            tabIndex="0"
            className="ActionsDelete"
            title="Delete"
            onClick={props.onAction.bind(null, 'delete')}>x</span>
    </div>

Actions.propTypes = {
    onAction: PropTypes.func,
};

Actions.defaultProps = {
    onAction: () => { },
};

export default Actions