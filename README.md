## command to run the app
```bash
npm run start
```

## Tech Stack used
### Next.JS:-
1. handles server-side rendering, which improves performance and SEO. Your app loads faster because the initial HTML is generated on the server and sent to the browser.
2. Hot Module Replacement (HMR), which means your app updates instantly as you make changes during development without requiring a full page reload.
3. easier for binding HTML and JavaScript because It uses a component-based architecture that combines HTML and JavaScript in one place,has built-in state management

### Tailwind CSS:-
1. simple and easy in-line styling
2. Highly customizable
3. good developer community


### why kept all the code in a single component?
1. This web app have mainly 3 tightly coupled components,meaning lot of data and actions need to be transfered between components for every action, so To reduce data transfer between components. 

#### note:- This is a valid approach for small apps with tightly coupled components. For big apps, code redability and maintanability will be difficult.
