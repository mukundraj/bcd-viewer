export const TOOLTEXTS = 
  {
    common: {
      selpuck: "Select a puck. Each puck corresponds to a brain section. The pucks from left to right correspond to anterior to posterior brain sections.",
      nissl: "Checkbox to show or hide the Nissl image in the background.",
      wireframe: "Checkbox to show or hide the Allen CCF wireframe in the background.",
      dendro: "Select a brain region to filter beads by region. The arrow on right of the region name below can be clicked to jump to the puck/section with the most beads in that region.",
      pid: "Currently selected puck id. Each puck corresponds to a brain section. The pucks from left to right correspond to anterior to posterior brain sections.",
    },
    ge: {
      selectgene: "Select a gene via textbox. A spatial, colorcoded map of expression levels for that gene will appear in the space below. A second gene may be selected in the right adjacent textbox to view expression color coded according to expresion levels of both genes using a 2D colormap.",
      umithresh: "Set UMI count threshold for each bead for the selected gene using the slider on the right. If a second gene is selected, a second slider appears on the right allowing to set the threshold for that gene.",
      toggle: "Toggle between average gene expression shown across sections(P) or across brain regions (R). Avg expression is shown in the bar graph on the right where each bar corresponds to a section or a region. Left to right on the bargraph corresponds anterior to posterior brain sections/regions.",
      freqbar_p: "Bar graph currently shows avg gene expression across sections. Left to right on the bargraph corresponds anterior to posterior brain sections/regions. ",
      freqbar_r: "Bar graph currently shows avg gene expression across regions. Left to right on the bargraph corresponds anterior to posterior brain sections/regions. ",
      colormap: "Color map for gene expression levels for selected gene(s). If two genes are selected, the colormap is a 2D colormap with each axis corresponding to the expression levels of the two genes.", 
      opacity: "Set the opacity of bead markers that have been color coded by gene expression.",
      regenrich: "Find genes that are enriched in above selected region(s). Set minimum percent of gene's UMI counts inside region (upper slider) and maximum percent of gene UMI counts outside the selected region (lower slider) to filter genes based on chosen parameters.",
    },
    cs: {
    },
  };
