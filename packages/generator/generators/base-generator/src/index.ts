import { GeneratorContext, GeneratorCore } from '@modern-js/codesmith';
import { AppAPI } from '@modern-js/codesmith-api-app';
import { BaseSchema } from '@modern-js/generator-common';

const handleTemplateFile = async (
  context: GeneratorContext,
  generator: GeneratorCore,
  appApi: AppAPI,
) => {
  const { hasPlugin, generatorPlugin, ...extra } = context.config;

  let schema = BaseSchema;

  if (hasPlugin) {
    await generatorPlugin.installPlugins('custom', extra);
    schema = generatorPlugin.getInputSchema('custom');
  }

  await appApi.getInputBySchema(schema, context.config);
  await appApi.forgeTemplate('templates/**/*');
};

export default async (context: GeneratorContext, generator: GeneratorCore) => {
  const appApi = new AppAPI(context, generator);
  const { locale } = context.config;
  appApi.i18n.changeLanguage({ locale });

  if (!(await appApi.checkEnvironment())) {
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }

  generator.logger.debug(`start run @modern-js/base-generator`);
  generator.logger.debug(`context=${JSON.stringify(context)}`);
  generator.logger.debug(`context.data=${JSON.stringify(context.data)}`);

  await handleTemplateFile(context, generator, appApi);

  if (context.handleForged) {
    await context.handleForged('custom', context, context.config.hasPlugin);
  }

  generator.logger.debug(`forge @modern-js/base-generator succeed `);
};
