import * as React from 'react';

export default function connect (models, other) {
  return function (Component) {
    return class BalloonConnectComponent extends React.Component {
      componentDidMount () {
        Object.keys(models).forEach((key) => {
          models[key].on('update', this.updateView)
        })
      }

      componentWillUnmount () {
        Object.keys(models).forEach((key) => {
          models[key].removeListener('update', this.updateView)
        })
      }

      updateView = () => {
        this.forceUpdate();
      }

      render () {
        return (
          <Component
            {...this.props}
            {...other}
            {...models}
          />
        );
      }
    }
  }
}
