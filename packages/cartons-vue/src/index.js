import Model from 'cartons/model';

export function observe (data) {
  Object.keys(data).forEach((key) => {
    let value = data[key];
    if (Model.isModel(value)) {
      value.on('update', () => {
        data[key] = '_cartons_vue_update';
      })

      Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get: function () {
          return value;
        },

        set: function () {}
      })
    }
  })
  return data;
}