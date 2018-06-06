import * as React from 'react';
import Model from 'cartons/model'

export default function observer () {
  return function (Component) {
    return class CartonsObserverComponent extends React.Component {
      constructor (props) {
        super(props);

        this._listeners = {};
      }

      componentDidMount () {
        this.observe(this.props);
      }

      componentWillUnmount () {
        this.removeListener();
      }

      componentWillReceiveProps (nextProps) {
        this.removeListener();
        this.observe(nextProps);
      }

      render () {
        return (
          <Component
            {...this.props}
          />
        )
      }

      updateView = () => {
        this.forceUpdate();
      }

      observe = (props) => {
        Object.keys(props).forEach((key) => {
          if (props[key] instanceof Model) {
            this._listeners[key] = props[key].on('update', this.updateView);
          }
        })
      }

      removeListener () {
        let listeners = this._listeners;
        Object.keys(listeners).forEach((key) => {
          listeners[key]()
        })
        this._listeners = {};
      }
    }
  }
}