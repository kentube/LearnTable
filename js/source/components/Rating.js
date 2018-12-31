import classNames from 'classnames';
//import React, { Component, PropTypes } from 'react';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Rating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: props.defaultValue,
            tmpRating: props.defaultValue,
        };
    }
    getValue() { // all our inputs provide this
        return this.state.rating;
    }
    setTemp(rating) { // on mouse over
        this.setState({ tmpRating: rating });
    }
    setRating(rating) { // on click
        this.setState({
            tmpRating: rating,
            rating: rating,
        });
    }
    reset() { // on mouse out, go back to the real rating
        this.setTemp(this.state.rating);
    }
    componentWillReceiveProps(nextProps) { // react to outside changes
        this.setRating(nextProps.defaultValue);
    }
    render() {
        const stars = [];
        for (let i = 1; i <= this.props.max; i++) {
            stars.push(
                <span
                    className={i <= this.state.tmpRating ? 'RatingOn' : null}
                    key={i}
                    onClick={!this.props.readonly && this.setRating.bind(this, i)}
                    onMouseOver={!this.props.readonly && this.setTemp.bind(this, i)}
                >
                    &#9734;
                </span>);
        }
        return (
            <div
                className={classNames({
                    'Rating': true,
                    'RatingReadonly': this.props.readonly,
                })}
                onMouseOut={this.reset.bind(this)}
            >
                {stars}
                {this.props.readonly || !this.props.id
                    ? null
                    : <input
                        type="hidden"
                        id={this.props.id}
                        value={this.state.rating} />
                }
            </div>
        );
    }    
}

Rating.propTypes = {
    defaultValue: PropTypes.number,
    readonly: PropTypes.bool,
    max: PropTypes.number,
};

Rating.defaultProps = {
    defaultValue: 0,
    max: 5,
};

export default Rating