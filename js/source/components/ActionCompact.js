import React from 'react';
import PropTypes from 'prop-types';

const ActionCompact = props =>
    <div className="ActionCompact">
        <span
            className={props.isMobile?"ActionsNameCompact":"ActionsName"}
            >{props["name"]}</span>
        <span
            tabIndex="0"
            className={props.isMobile?"ActionsEditCompact":"ActionsEdit"}
            title="Edit"
            onClick={props.onAction.bind(null, 'edit')}>&#10000;</span>
        <span
            tabIndex="0"
            className={props.isMobile?"ActionsDeleteCompact":"ActionsDelete"}
            title="Delete"
            onClick={props.onAction.bind(null, 'delete')}>x</span>
    </div>

ActionCompact.propTypes = {
    onAction: PropTypes.func,
};

ActionCompact.defaultProps = {
    onAction: () => { },
};

export default ActionCompact