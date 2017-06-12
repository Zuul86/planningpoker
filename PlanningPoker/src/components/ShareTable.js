import React, { PropTypes } from 'react';

const ShareTable = (props) => {
    return (
        <div className="row">
                    <div className="col-md-12 text-center">
                        <span className="glyphicon glyphicon-menu-up" style={shareDisplayButton} />
                    </div>
                </div>
    );
};

const shareDisplayButton = {
    border: 'solid black thin',
    width: '5em'
};

export default ShareTable;