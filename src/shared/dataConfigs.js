export const DATACONFIGS = 
  [
    {
      id: 0,
      basePath: "https://storage.googleapis.com/bcdportaldata",
      prefix:"gene_",
      geneOptions: ['Pcp4', 'Calb1', 'Gng13', 'Gabra6', 'Mbp', 'Plp1', 'Mag', 'Myoc', 'Agt', 'Gfap', 'Slc1a3', 'Aqp4', 'Dcn', 'Flt1', 'Rarres2', 'Foxj1', 'Xpo7', 'Cul1', 'Herc1', 'Rb1cc1', 'Setd1a', 'Trio', 'Cacna1g', 'Sp4', 'Gria3', 'Grin2a'],
      maxCountMetadataKey: "maxCount",
      title: "Gene Expression",
      relativePath: "/genexp_data",
      freqBarsDataPath:"test_data2/gene_jsons_s9e"
    },
    {
      id: 1,
      basePath: "https://storage.googleapis.com/bcdportaldata",
      prefix:"cell_",
      cellOptions: [],
      maxCountMetadataKey: "maxCount",
      title: "Cell Score",
      relativePath: "/cellspatial_data",
    },
    // {
    //   id: 2,
    //   basePath: "https://storage.googleapis.com/ml_portal/test_data/gene_csvs",
    //   prefix: "rc_",
    //   geneOptions: ['Gad1', 'Gad2', 'Slc17a7'],
    //   maxCountMetadataKey: "maxCount",
    //   title: "Regionally Aggregated Expression",
    //   relativePath: "test_data2/gene_csvs"
    // },
    // {
    //   id: 3,
    //   basePath: "https://storage.googleapis.com/ml_portal/test_data/gene_csvs",
    //   prefix: "rnc_",
    //   geneOptions: ['Gad1', 'Gad2', 'Slc17a7'],
    //   maxCountMetadataKey: "maxNormedCount",
    //   title: "Regionally Aggregated Normalized Expression",
    //   relativePath: "test_data2/gene_csvs"
    // },
    // {
    //   id: 4,
    //   basePath: "https://storage.googleapis.com/ml_portal/test_data/gene_csvs",
    //   prefix: "gene_",
    //   geneOptions: [''],
    //   maxCountMetadataKey: "maxCount",
    //   title: "Regionally Aggregated Normalized Expression2",
    //   relativePath: "test_data2/gene_csvs_s9d",
    //   freqBarsDataPath:"test_data2/gene_jsons_s9e"
    // },
  ]
