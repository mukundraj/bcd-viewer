// create a new functional component

import Loader from '../LoaderComponent';
import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

const GenexGuard = ({dataConfig}) => {

  const [validatedURLParams, setValidatedURLParams] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const gene = searchParams.get('gene')

  // read URL parameters

  // todo: check if URL parameters are valid


  useEffect(() => {
    if (gene) {
      let validatedURLParamsTmp = {
        gene: gene
      }
      console.log('validatedURLParams', validatedURLParamsTmp)
      setValidatedURLParams(validatedURLParamsTmp);
    }
  }, [gene]);


  return (
    <>
      <Loader dataConfig={dataConfig} validatedURLParams={validatedURLParams} />
    </>
  );

}

export default GenexGuard;

// localhost:3000/genex?paramgene=Pcp4
