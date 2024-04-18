import styles from "./page.module.css";

import ForwardIcon from "@mui/icons-material/Forward";

import Events from "./Events";
import ExampleEvents from "./ExampleEvents";
import ExampleGrid from "./ExampleGrid";

export default async function Home({ searchParams }) {
  return (
    <>
      <h1 className={styles.title}>Next Template</h1>
      <p className={styles.description} style={{ marginBottom: "2rem" }}>
        This is a Next.js boilerplate template that provides a solid foundation
        for building modern web applications. It includes a well-structured
        Next.js App Router folder structure, built using the latest technologies
        and best practices. This boilerplate is preconfigured with NextAuth.js
        for authentication. It integrates with MongoDB as the database and
        supports multiple authentication providers.
      </p>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}
      >
        <h3>Full CRUD examples</h3>
        <span className="bounce">
          <ForwardIcon fontSize="large" className="rotate-90" />
        </span>
      </div>
      <Events searchParams={searchParams} />

      <ExampleEvents />

      <ExampleGrid />
    </>
  );
}
