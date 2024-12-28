import { readFile } from "fs";
import { Express } from "express";
import * as features from "./custom_features";

// The callback function is used to provide Express with the rendered content 
// or an error if something goes wrong.
const renderTemplate = (path: string, context: any,
    callback: (err: any, response: string | undefined) => void) => {
        readFile(path, (err, data) => {
            if (err != undefined) {
                callback("Cannot generate content", undefined);
            } else {
                // console.log(data.toString());
                callback(undefined, parseTemplate(data.toString(), { ...context, features }));           
            }
        }
    );
};

const parseTemplate = (template: string, context: any) => {
    const ctx = Object.keys(context)
    .map((k) => `const ${k} = context.${k}`)
    .join(";");
    // console.log(ctx);
    const expr = /{{(.*)}}/gm;
    return template.toString().replaceAll(expr, (match, group) => {
        const evalFunc= (expr: string) => {
            return eval(`${ctx};${expr}`)
        }
        try {
            if (group.trim()[0] === "@") {
                group = `features.${group.trim().substring(1)}`;
                group = group.replace(/\)$/m, ", context, evalFunc)");
            }
            let result = evalFunc(group);
            if (expr.test(result)) {
                result = parseTemplate(result, context);
            }
            return result;
        } catch (err: any) {
            return err;
        }
        /* console.log(match, group);
        console.log(`${ctx};${group}`);
        return eval(`${ctx};${group}`); */
    });
}

// The Express package has integrated support for template engines
// The Express.engine method registers the template engine with Express.
// It tells Express to use the renderTemplate function to render template files 
// that have a .custom file extension.
export const registerCustomTemplateEngine = (expressApp: Express) =>
    expressApp.engine("custom", renderTemplate);