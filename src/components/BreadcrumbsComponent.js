import useBreadcrumbs from 'use-react-router-breadcrumbs';
import { NavLink} from "react-router-dom"

const Breadcrumbs = () => {

  // define custom breadcrumbs for certain routes.
  // breadcumbs can be components or strings.
  const routes = [
    { path: '/', exact: true, breadcrumb: 'Home'},
    { path: '/genex', breadcrumb: 'Gene Expression' },
    { path: '/anaindex', breadcrumb: 'Analysis Index' },
    // { path: '/custom-props', breadcrumb: CustomPropsBreadcrumb, props: { someProp: "Hi" }},
  ];

  // const breadcrumbs = useBreadcrumbs(routes, { excludePaths: ['/'] });
  const breadcrumbs = useBreadcrumbs(routes);

  return (
    <div style={{marginBottom:"10px"}}>
      {/* {breadcrumbs.map(({ breadcrumb }) => breadcrumb)} */}
      {breadcrumbs.map(({
        match,
        breadcrumb
      }, index, array) => (
        <span key={match.pathname}>
          {index<array.length-1?
            <NavLink to={match.pathname}>{breadcrumb}</NavLink>:<span>{array.length===1?"":<h6 style={{display:"inline-block"}}>{breadcrumb}</h6>}</span>}
          {index<array.length-1? " / " :""}
        </span>
      ))}
    </div>
  );
}

export default Breadcrumbs;

