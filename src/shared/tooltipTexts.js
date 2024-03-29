export const TOOLTEXTS = 
  {
    common: {
      selpuck: "Click on nissl image on right to load data from puck adjacent to that section. Each puck corresponds to a brain section. The pucks from left to right correspond to anterior to posterior brain sections. Currently selected puck is indicated with a red border. Use the row of dots at the center to navigate directly to different regions along the A-P axis.",
      nissl: "Check/uncheck to show or hide the Nissl image in the background.",
      wireframe: "Check/uncheck to show or hide the Allen CCF wireframe in the background.",
      dendro: "Select a brain region to filter beads by region. The arrow on right of the region name below can be clicked to jump to the puck/section with the most beads in that region.",
      pid: "Currently selected puck id. Each puck corresponds to a brain section. The pucks from left to right correspond to anterior to posterior brain sections.",
    },
    ge: {
      selectgene: "Select a gene via textbox. A spatial, colorcoded map of expression levels for that gene will appear in the space below. A second gene may be selected in the right adjacent textbox to view expression color coded according to expresion levels of both genes using a 2D colormap.",
      umithresh: "Set UMI count threshold for each bead for the selected gene using the slider on the right. If a second gene is selected, a second slider appears on the right allowing to set the threshold for that gene.",
      toggle: "Toggle between average gene expression shown across sections(P) or across brain regions (R). Avg expression is shown in the bar graph on the right where each bar corresponds to a section or a region. Left to right on the bargraph corresponds anterior to posterior brain sections/regions.",
      freqbar_p: "Bar graph currently shows avg gene expression per 10k beads across brain sections. Left to right on the bargraph corresponds anterior to posterior brain sections.",
      freqbar_r: "Bar graph currently shows avg gene expression per 10k beads across brain regions. Left to right on the bargraph corresponds anterior to posterior brain regions. ",
      dendrobar: "When one/more region(s) are selected below, bar graph appears on left showing avg gene expression per 10 beads for beads inside selected regions across brain sections. Left to right on the bargraph corresponds anterior to posterior brain sections. ",
      colormap: "Color map for gene expression levels for selected gene(s). If two genes are selected, the colormap is a 2D colormap with each axis corresponding to the expression levels of the two genes.", 
      opacity: "Set the opacity of bead markers, which have been color coded by gene expression.",
      regenrich: "Find genes that are enriched in above selected region(s). Set minimum percent of gene's UMI counts inside region (upper slider) and maximum percent of gene UMI counts outside the selected region (lower slider) to filter genes based on chosen parameters.",
    },
    sc: {
      avg: "Sort by average expression of selected gene in each cluster, which is computed as follows:  (sum of counts of gene A in cluster i) / (total number of cells in cluster i)",
      pct: "Sort by percent of cells in cluster that have nonzero counts of selected gene, which is computed as follows: (number of cells in cluster i with non-zero counts of gene A) / (total number of cells in cluster i)",
      aggby: "Aggregate cells by cluster (aka celltype), metacluster, or cell class.",
    },
    cs: {
      select: "Select to aggregate cells by celltype, metacluster, or cell class.  Then select a specific instance or cellclass, metacluster, or celltype to view its spatial distribution over the selected puck. If aggregation is set to celltype, either one or two celltypes may be selected to plot one or both cell types simultaneously.",
      cellscore: "Set a score threshold for each bead for each cluster using the slider on the right. If a second celltype cluster is selected, a second slider appears on the right allowing to set the threshold for that celltype.",
      toggle: "Toggle between average scores shown across sections(P) or across brain regions (R). Avg scores is shown in the bar graph on the right where each bar corresponds to a section or a region. Left to right on the bargraph corresponds anterior to posterior brain sections/regions.",
      freqbar_p: "Bar graph currently shows avg scores across sections. Left to right on the bargraph corresponds anterior to posterior brain sections/regions. ",
      freqbar_r: "Bar graph currently shows avg scores across regions. Left to right on the bargraph corresponds anterior to posterior brain sections/regions. ",
      colormap: "Color map for scores of selected cluster. If two genes are selected, the colormap is a 2D colormap with each axis corresponding to score of each celltype cluster.", 
      opacity: "Set the opacity of bead markers, which have been color coded by scores.",
      regenrich: "Find celltype clusters that are enriched in above selected region(s). Set minimum percent of beads inside selected region that must contain selected celltype (upper slider) and minimum bead count needed in selected region (lower slider) to filter celltypes based on chosen parameters.",
    },
  };
