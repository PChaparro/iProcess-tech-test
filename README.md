# iProcess Technical Test

My solution for the technical test for the Junior Frontend Developer position at iProcess.

## 📂 Folder structure

In the `src` folder you will find the following structure:

- `assets`: Images and other assets used in the project that doesn't need to be served as the static files in the `public` folder.

- `components`: **Global** components that are used in multiple pages.

- `config`: Configuration files for the project, like constants.

- `hooks`: Custom hooks that can be used **in multiple places** in the project.

- `lib`: Utility functions that are used **in multiple places** in the project.

- `pages`: The pages of the project. Each subfolder represents a page. Inside each subfolder you will find a `components`, `hooks` and `context` folders with the components, hooks and context providers used **only** in that page. This organization helps to keep high **cohesion** among all the elements that are part of a page to make it easier to maintain and understand.

- `types`: Typescript types and interfaces used **globally** in the project.

## 🚀 Running locally

1. Clone the repository:

```bash
git clone https://github.com/PChaparro/iProcess-tech-test.git
```

2. Install the dependencies:

```bash
cd iProcess-tech-test
pnpm i # or npm i
```

3. Run the development server:

```bash
pnpm dev # or npm run dev
```

4. Open [http://localhost:5173/](http://localhost:5173/) with your browser to see the result.
