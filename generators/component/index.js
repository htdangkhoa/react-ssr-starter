module.exports = {
  description: 'Component Generator',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'component name',
    },
    {
      type: 'confirm',
      name: 'unit_test',
      message: 'do you want to add unit test?',
      default: false,
    },
  ],
  actions: (data) => {
    const actions = [
      {
        type: 'add',
        path: 'src/client/components/{{properCase name}}/index.jsx',
        templateFile: 'generators/component/index.jsx.hbs',
      },
    ];

    if (data.unit_test) {
      actions.push({
        type: 'add',
        path: 'src/client/components/{{properCase name}}/__tests__/index.test.jsx',
        templateFile: 'generators/component/index.test.jsx.hbs',
      });
    }

    return actions;
  },
};
