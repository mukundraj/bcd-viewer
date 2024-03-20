export const DATACONFIGS = 
  [
    {
      basePath: "https://storage.googleapis.com/bcdportaldata",

      geneOptions: ['Frmd7'],

      // GeneExp data
      maxCountMetadataKey: "maxCount",
      dpathGeneExprs: "/batch_230131/genexp_data/gene_exprs_cshl",
      dpathFreqBarsJsons: "/batch_231112/geneexp/s9_analysis/s9e/gene_jsons_s9e_240227",
      dpathDendroBarsJsons: "/batch_231112/geneexp/s9_analysis/s9f/gene_jsons_s9f_240318",
      regEnrichZarrPath: "/batch_231112/geneexp/s9_analysis/s9h/nz_aggr_240220.zarr",
      nameInfoFilePath: "/batch_231112/geneexp/s9_analysis/s9h/gene_info_240220.json",
    },
    {
      basePath: "https://storage.googleapis.com/bcdportaldata",

      // SingleCell data

      // dpathScZarr: "/batch_231112/single_cell/s1/scZarr_231207.zarr",
      // dpathMappedCellTypesToIdx: "/batch_231112/single_cell/s2/s2_regtocell_231207/mappedCellType_to_idx.json",
      // dpathRegionToCelltype: "/batch_231112/single_cell/s2/s2_regtocell_231207/region_to_celltype.json",
      // dpathIdAcroNameMap: "/batch_231112/single_cell/s1/idAcroNameMap/idAcroNameMap.csv",
      // dpathAggrScZarr: "/batch_231112/single_cell/s3/aggedSCdata_231207.zarr",
      dpathScZarr: "/batch_231112/single_cell/s1/scZarr_240318.zarr",
      dpathMappedCellTypesToIdx: "/batch_231112/single_cell/s2/s2_regtocell_240318/mappedCellType_to_idx.json",
      dpathRegionToCelltype: "/batch_231112/single_cell/s2/s2_regtocell_240318/region_to_celltype.json",
      dpathIdAcroNameMap: "/batch_231112/single_cell/s1/idAcroNameMap/idAcroNameMap.csv",
      dpathAggrScZarr: "/batch_231112/single_cell/s3/aggedSCdata_240318.zarr",
    },
    {

      basePath: "https://storage.googleapis.com/bcdportaldata",

      // CellSpatial data
      // dpathCellScores: "/batch_231112/cell_spatial/s1/cellscores_cshl_231207c",
      // dpathFreqBarsJsons: "/batch_231112/cell_spatial/s2/s2c_cell_jsons_231207",
      // regEnrichZarrPath: "/batch_231112/cell_spatial/s2/s2d_region_enrich/nz_zarr_231207.zarr",
      // nameInfoFilePath: "/batch_231112/cell_spatial/s2/s2d_region_enrich/name_info_231207.json",
      dpathCellScores: "/batch_231112/cell_spatial/s1/cellscores_cshl_240318",
      dpathFreqBarsJsons: "/batch_231112/cell_spatial/s2/s2c_cell_jsons_240318",
      regEnrichZarrPath: "/batch_231112/cell_spatial/s2/s2d_region_enrich/nz_zarr_231207.zarr",
      nameInfoFilePath: "/batch_231112/cell_spatial/s2/s2d_region_enrich/name_info_231207.json",

    }
  ]
