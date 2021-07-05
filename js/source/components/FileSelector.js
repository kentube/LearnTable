import React from 'react';
//import * as React from "react";
import PropTypes from 'prop-types';

class FileSelector extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = { files: null };
    }

    // onAction(f){
    //     // eslint-disable-next-line no-console
    //     console.log('onAction: f is ' + f);
    // }

    processFileChange(e)
    {
      var files4 = e.target.files; // FileList object
      // Loop through the FileList and render image files as thumbnails.
      // eslint-disable-next-line no-cond-assign
      for (var i = 0, f; f = files4[i]; i++) {
        var fileResult = 'No value';
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function(theFile, onAction1) {
          return function(e) {
            fileResult = e.target.result;
            onAction1.bind(this, fileResult)();
          };
        })(f, this.props.onAction0);
        reader.readAsText(f);
      }
    }

    render ()
    {
        return (
        <div className="FileSelector">
            <button {...this.props} className="Button FileSelectorButton" onClick={() => this.inputElement.click()} />
            <input type="file" style={{display: 'none', width: '0px'}} ref={input => this.inputElement = input} onChange={(e) => 
              {
                this.processFileChange(e);

                var files = e.target.files;
                this.setState({ files: files });
              }
            }
            />
        </div>
        );
    }
}

// FileSelector.propTypes = {
//   onAction: PropTypes.func.isRequired,
// };

// FileSelector.defaultProps = {
//   onAction: () => { },
// };

export default FileSelector
