import Head from "next/head";
const Meta = (props) => (
  <Head>
    <title>{props.title}</title>
    <meta name="description" content={props.desc} />
    <meta name="author" content="Angel Ruggia Dufour" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="keywords" content={props.keywords} />
    <meta property="og:type" content="website" />
    <meta name="og:title" property="og:title" content={props.title} />
    <meta
      name="og:description"
      property="og:description"
      content={props.desc}
    />
    <meta
      property="og:site_name"
      content="Servia - Encuentra tu servicio ideal"
    />
    <meta property="og:url" content={`${props.canonical}`} />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content={props.title} />
    <meta name="twitter:description" content={props.desc} />
    <meta name="twitter:site" content="@RuggiaAngel" />
    <meta name="twitter:creator" content="@RuggiaAngel" />
    <link rel="icon" type="image/png" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/favicon.ico" />
    {props.image ? (
      <meta property="og:image" content={`${props.image}`} />
    ) : (
      <meta property="og:image" content="/IconoV4.png" />
    )}
    {props.image && <meta name="twitter:image" content={`${props.image}`} />}
    {/* {props.canonical && <link rel="canonical" href={`${props.canonical}`} />} */}
  </Head>
);
export default Meta;
