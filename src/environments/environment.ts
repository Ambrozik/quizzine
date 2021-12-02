// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  backend: {
    protocol: 'http',
    host: '0.0.0.0',
    port: '3000',
    endpoints: {
      allUsers: '/users',
      oneUserId: '/users/id/:id',
      oneUserName: '/users/username/:username',
      allQuestions: '/questions',
      oneQuestion: '/questions/:id',
      register: '/auth/register',
      login: '/auth/login',
      allTags: '/tags',
      oneTag: '/tags/:name',
      quizzes:'/quizzes',
      delete: '/users/:id',
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
