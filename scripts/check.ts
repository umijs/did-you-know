import Joi from 'joi';
// @ts-ignore
import data from '../package.json';

//   {
//     "text": "hello",
//     "url": "https://www.abc.com",
//     "majorVersion": 4,
//     "framework": [
//       "umi",
//       "@umijs/max"
//     ]
//   },
const schemaDidYouKnow = Joi.array().items(
  Joi.object({
    text: Joi.string(),
    url: Joi.string().uri(),
    majorVersion: Joi.number().min(3),
    framework: Joi.array().items(Joi.string()).optional(),
  }),
);

const { error } = schemaDidYouKnow.validate(data.didYouKnow);
if (error) {
  const { details, _original } = error;
  // format
  console.log('DidYouKnow Data Error:');
  details.forEach((i: any) => {
    console.error(i.message);
    console.error(i.context);
    console.error(_original[i.path[0]]);
  });
  process.exit();
}
