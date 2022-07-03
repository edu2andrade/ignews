import * as prismic from "@prismicio/client";
// import Prismic from "@prismicio/client";

export function getPrismicClient(req?: unknown) {
  const client = prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    defaultParams: req,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });
  return client;
}

// This is how the Prismic doc's tell us to do:

// Fill in your repository name
// export const repositoryName = "ignews10001";

// export const getPrismicClient = prismic.createClient(repositoryName, {
// If your repository is private, add an access token
// accessToken: process.env.PRISMIC_ACCESS_TOKEN

// This defines how you will structure URL paths in your project.
// Update the types to match the Custom Types in your project, and edit
// the paths to match the routing in your project.
//
// If you are not using a router in your project, you can change this
// to an empty array or remove the option entirely.

// routes: [
// {
//   type: "homepage",
//   path: "/",
// },
// {
//   type: "blogpost",
//   path: "/:uid",
// },
//   ],
// });
