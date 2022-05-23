export const DATACONFIGS = 
  [
    {
      id: 0,
      basePath: "https://storage.googleapis.com/ml_portal/test_data/gene_jsons",
      prefix:"gene_",
      geneOptions: ['Pcp4', 'Calb1', 'Gng13', 'Gabra6', 'Mbp', 'Plp1', 'Mag', 'Myoc', 'Agt', 'Gfap', 'Slc1a3', 'Aqp4', 'Dcn', 'Flt1', 'Rarres2', 'Foxj1'],
      title: "Gene Expression"
    },
    {
      id: 1,
      basePath: "https://storage.googleapis.com/ml_portal/test_data/gene_csvs",
      prefix: "rc_",
      geneOptions: ['Gad1', 'Gad2', 'Slc17a7'],
      title: "Regionally Aggregated Expression"
    },
  ]
