export const DATACONFIGS = 
  [
    {
      basePath: "https://storage.googleapis.com/bcdportaldata",

      geneOptions: ['Frmd7'],

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
      dpathScZarr: "/batch_230131/singlecell_data/scZarr_321017.zarr",
      dpathMappedCellTypesToIdx: "/batch_230131/singlecell_data/s2/s2_regtocell_230208/mappedCellType_to_idx.json",
      dpathRegionToCelltype: "/batch_230131/singlecell_data/s2/s2_regtocell_230208/region_to_celltype.json",
      dpathIdAcroNameMap: "/batch_230131/singlecell_data/s1/idAcroNameMap/idAcroNameMap.csv",
      dpathAggrScZarr: "/batch_231112/single_cell/v3/aggedSCdata.zarr",
    },
    {

      basePath: "https://storage.googleapis.com/bcdportaldata",

      // CellSpatial data
      // dpathCellScores: "/batch_230131/cellspatial_data/cellscores",
      dpathCellScores: "/batch_231112/cellspatial_data/cellscores_cshl_231128",
      // dpathFreqBarsJsons: "/cellspatial_data/freqbars/cell_jsons_s2c",
      dpathFreqBarsJsons: "/batch_231112/cellspatial_data/freqbars/cell_jsons_s2c_231128",
      regEnrichZarrPath: "/batch_230131/cellspatial_data/s2d_region_enrich/nz_zarr_230222.zarr",
      nameInfoFilePath: "/batch_230131/cellspatial_data/s2d_region_enrich/name_info_230222.json",

    }
  ]
