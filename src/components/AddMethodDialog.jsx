import React from "react";
import exKitPipelineMethods from "../tools/exKitPipelineMethods";
import ReactDOM from "react-dom";

class AddMethodDialog extends React.Component {
  constructor(props) {
    super(props);

    const defaultMethod = Object.keys(exKitPipelineMethods)[0] || null;

    this.state = {
      methodName: defaultMethod,
      clonedInputs: 0
    };
  }

  select = null;
  refSelect = element => {
    this.select = element;
  };

  args = {};
  refArg = (index, element) => {
    if (element) {
      this.args[index] = element;
    } else {
      delete this.args[index];
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const args = Object.keys(this.args).map(key => this.args[key].value);
    this.props.onAdd(this.state.methodName || this.select.value, args);
  };

  handleCancel = e => {
    e.preventDefault();
    this.props.onClose();
  };

  handleSelect = e => {
    this.setState({
      methodName: this.select.value,
    });
  };

  handleAddArg = e => {
    e.preventDefault();
    this.setState({
      clonedInputs: this.state.clonedInputs + 1
    });
  };

  handleRemoveArg = e => {
    e.preventDefault();
    if (this.state.clonedInputs !== 0) {
      this.setState({
        clonedInputs: this.state.clonedInputs - 1
      });
    }
  };

  render() {
    const methodName = this.state.methodName;
    const methodScheme = exKitPipelineMethods[this.state.methodName];

    const options = Object.keys(exKitPipelineMethods).map(key => {
      return (
        <option key={key} value={key}>{key}</option>
      );
    });

    let args = null;
    if (methodScheme) {
      if (methodScheme.args) {
        args = methodScheme.args.map((arg, index) => {
          let element = null;
          if (arg.type === 'select') {
            element = (
              <select ref={this.refArg.bind(this, index)}>
                {arg.values.map(({key, text}) => {
                  return (
                    <option key={key} value={key}>{text}</option>
                  );
                })}
              </select>
            );
          } else {
            element = (
              <input ref={this.refArg.bind(this, index)} type={arg.type}/>
            );
          }
          return (
            <div className={'method-arg'} key={index}>
              <div className={'arg-name'}>{arg.name}</div>
              <div className={'arg-input'}>
                {element}
              </div>
            </div>
          );
        });

        if (methodScheme.multipleArgs) {
          const fistsArg = methodScheme.args[0];
          for (let i = 0; i < this.state.clonedInputs; i++) {
            const index = args.length;
            args.push(
              <div className={'method-arg'} key={index}>
                <div className={'arg-name'}>{fistsArg.name}</div>
                <div className={'arg-input'}>
                  <input ref={this.refArg.bind(this, index)} type={fistsArg.type}/>
                </div>
              </div>
            );
          }

          let removeBtn = null;
          if (this.state.clonedInputs > 0) {
            removeBtn = (
              <button onClick={this.handleRemoveArg}>Remove argument</button>
            );
          }

          args.push(
            <div className={'arg-controls'}>
              <button onClick={this.handleAddArg}>Add argument</button>
              {removeBtn}
            </div>
          );
        }
      }
    }

    return ReactDOM.createPortal(
      <div className={'method-dialog'}>
        <form onSubmit={this.handleSubmit}>
          <div className={'method-select-wrapper'}>
            <select className={'method-select'} ref={this.refSelect} onChange={this.handleSelect} defaultValue={methodName}>
              {options}
            </select>
          </div>
          {args}
          <div className={'dialog-footer'}>
            <button className={'dialog-button dialog-button-submit'} type="submit">Add</button>
            <button className={'dialog-button'} onClick={this.handleCancel}>Cancel</button>
          </div>
        </form>
      </div>,
      document.body
    );
  }
}

export default AddMethodDialog;