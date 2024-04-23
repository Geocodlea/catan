import Link from "next/link";

export default (params) => {
  if (params.field === "link") {
    return (
      <Link
        href={params.value}
        style={{
          color: "blue",
        }}
      >
        {params.value.slice(-10)}
      </Link>
    );
  }
};
