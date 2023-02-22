export const DATACONFIGS = 
  [
    {
      basePath: "https://storage.googleapis.com/bcdportaldata",

      geneOptions: ['Pcp4', 'Calb1', 'Gng13', 'Gabra6', 'Mbp', 'Plp1', 'Mag', 'Myoc', 'Agt', 'Gfap', 'Slc1a3', 'Aqp4', 'Dcn', 'Flt1', 'Rarres2', 'Foxj1', 'Xpo7', 'Cul1', 'Herc1', 'Rb1cc1', 'Setd1a', 'Trio', 'Cacna1g', 'Sp4', 'Gria3', 'Grin2a'],

      // GeneExp data
      maxCountMetadataKey: "maxCount",
      dpathGeneExprs: "/batch_230131/genexp_data/gene_exprs_cshl",
      dpathFreqBarsJsons: "/genexp_data/freqbars/gene_jsons_s9e",
      regEnrichZarrPath: "/batch_230131/genexp_data/s9h/nz_aggr_230222.zarr",
      nameInfoFilePath: "/batch_230131/genexp_data/s9h/gene_info_230222.json",
    },
    {
      basePath: "https://storage.googleapis.com/bcdportaldata",

      // SingleCell data
      dpathScZarr: "/batch_230131/singlecell_data/scZarr_230221.zarr",
      dpathMappedCellTypesToIdx: "/batch_230131/singlecell_data/s2/s2_regtocell_230208/mappedCellType_to_idx.json",
      dpathRegionToCelltype: "/batch_230131/singlecell_data/s2/s2_regtocell_230208/region_to_celltype.json",
      dpathIdAcroNameMap: "/batch_230131/singlecell_data/s1/idAcroNameMap/idAcroNameMap.csv",
    },
    {

      basePath: "https://storage.googleapis.com/bcdportaldata",

      // CellSpatial data
      dpathCellScores: "/batch_230131/cellspatial_data/cellscores",
      dpathFreqBarsJsons: "/cellspatial_data/freqbars/cell_jsons_s2c",
      regEnrichZarrPath: "/batch_230131/cellspatial_data/s2d_region_enrich/nz_zarr_230222.zarr",
      nameInfoFilePath: "/batch_230131/cellspatial_data/s2d_region_enrich/name_info_230222.json",

    }
  ]
