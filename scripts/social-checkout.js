/**
 * ==============================================================================
 * NURAAN PERFUMES — SOCIAL CHECKOUT ENGINE
 * Direct WhatsApp Business (+91 8591059608) & Instagram (@Nuraanperfumes)
 * Zero Payment Gateway Friction • Deep-link messaging with Auto-Copy
 * ==============================================================================
 */

const SocialCheckout = {
  /**
   * Order a single fragrance on WhatsApp
   */
  orderOnWhatsApp: function(product, sizeType = '12ml') {
    const config = window.NURAAN_CONFIG || {};
    const phone = config.whatsappNumber || "918591059608";
    const brandName = config.brandName || "Nuraan Perfumes";
    
    const is12ml = sizeType === '12ml';
    const sizeLabel = is12ml ? "12ml Single Roll-On Bottle (Luxury Box)" : "3ml Discovery Option";
    const price = is12ml ? product.price12ml : product.price3mlOption;
    const currency = config.currencySymbol || "₹";

    const message = 
`✦ *NEW ORDER INQUIRY — ${brandName.toUpperCase()}* ✦

Hello Nuraan Perfumes,
I would like to place an order for:

• *Fragrance:* ${product.name}
• *Collection:* ${product.collection} Collection
• *Format:* ${sizeLabel}
• *Price:* ${currency}${price.toLocaleString('en-IN')}
• *Product Code:* #${product.id.toUpperCase()}

Please share your UPI / GPay / Bank details and estimated dispatch timeline.

*My Shipping Details:*
Name: 
Delivery Address: 
Pincode & City: 
Phone: 

Thank you!`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${phone}?text=${encoded}`;
    window.open(waUrl, '_blank');
  },

  /**
   * Inquire about a fragrance on Instagram DM with auto-copied summary
   */
  inquireOnInstagram: function(product, sizeType = '12ml') {
    const config = window.NURAAN_CONFIG || {};
    const igHandle = config.instagramHandle || "Nuraanperfumes";
    const is12ml = sizeType === '12ml';
    const sizeLabel = is12ml ? "12ml Single Roll-on" : "3ml Discovery Option";
    const price = is12ml ? product.price12ml : product.price3mlOption;
    const currency = config.currencySymbol || "₹";

    const summary = `Nuraan Perfumes Inquiry: ${product.name} [Code: #${product.id}] - ${sizeLabel} (${currency}${price})`;

    SocialCheckout.copyToClipboard(summary, function() {
      SocialCheckout.showToast(`✓ Copied "${product.name}" summary! Opening @${igHandle}...`, "success");
      setTimeout(function() {
        window.open(`https://ig.me/m/${igHandle}`, '_blank');
      }, 750);
    });
  },

  /**
   * Order a Curated Discovery Box on WhatsApp
   */
  orderComboOnWhatsApp: function(combo, size) {
    const config = window.NURAAN_CONFIG || {};
    const phone = config.whatsappNumber || "918591059608";
    const brandName = config.brandName || "Nuraan Perfumes";
    const currency = config.currencySymbol || "₹";

    const is12ml = size === '12ml';
    const activePrice = is12ml ? (combo.price12ml || 2999) : (combo.price3ml || combo.price || 1299);
    const activeMRP = is12ml ? (combo.mrp12ml || 4299) : (combo.mrp3ml || combo.mrp || 3299);
    const formatName = is12ml ? "6 × 12ml Luxury Coffret Box" : "6 × 3ml Precision Roll-on Discovery Box";

    const itemsList = combo.itemsIncluded ? combo.itemsIncluded.join(", ") : "";

    const message = 
`✦ *DISCOVERY BOX ORDER — ${brandName.toUpperCase()}* ✦

Hello Nuraan Perfumes,
I would like to order this curated Discovery Box:

• *Set Name:* ${combo.name}
• *Selected Size:* ${formatName}
• *Attars Included:* ${itemsList}
• *Price:* ${currency}${activePrice.toLocaleString('en-IN')} (MRP: ${currency}${activeMRP.toLocaleString('en-IN')})
• *Box Code:* #${combo.id.toUpperCase()}-${is12ml ? '12ML' : '3ML'}

Please share UPI details and dispatch schedule.

*Shipping Information:*
Name: 
Delivery Address: 
City & Pincode: 

Thank you!`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${phone}?text=${encoded}`;
    window.open(waUrl, '_blank');
  },

  /**
   * Inquire about a Curated Box on Instagram DM
   */
  inquireComboOnInstagram: function(combo, size) {
    const config = window.NURAAN_CONFIG || {};
    const igHandle = config.instagramHandle || "Nuraanperfumes";
    const currency = config.currencySymbol || "₹";

    const is12ml = size === '12ml';
    const activePrice = is12ml ? (combo.price12ml || 2999) : (combo.price3ml || combo.price || 1299);
    const formatLabel = is12ml ? "12ml Luxury Coffret" : "3ml Discovery Box";

    const summary = `Nuraan Perfumes Order: ${combo.name} (${formatLabel}) - ${currency}${activePrice.toLocaleString('en-IN')}`;

    SocialCheckout.copyToClipboard(summary, function() {
      SocialCheckout.showToast(`✓ Copied "${combo.name} (${formatLabel})" details! Opening @${igHandle}...`, "success");
      setTimeout(function() {
        window.open(`https://ig.me/m/${igHandle}`, '_blank');
      }, 750);
    });
  },

  /**
   * Order a Custom "Build Your Own" Discovery Box on WhatsApp
   */
  orderCustomBoxOnWhatsApp: function(size, selectedAttars, price) {
    const config = window.NURAAN_CONFIG || {};
    const phone = config.whatsappNumber || "918591059608";
    const brandName = config.brandName || "Nuraan Perfumes";
    const currency = config.currencySymbol || "₹";

    if (!selectedAttars || selectedAttars.length === 0) {
      SocialCheckout.showToast("Please choose at least 1 attar for your custom box!", "error");
      return;
    }

    let itemsFormatted = "";
    selectedAttars.forEach((attarName, idx) => {
      itemsFormatted += `  ${idx + 1}. *${attarName}*\n`;
    });

    const message = 
`✦ *BESPOKE CUSTOM DISCOVERY BOX — ${brandName.toUpperCase()}* ✦

Hello Nuraan Perfumes,
I have customized my own Discovery Box with the following ${selectedAttars.length} attars:

• *Box Format:* Custom ${size} Roll-on Discovery Box
• *Estimated Price:* ${currency}${price.toLocaleString('en-IN')}

*My Selected Attars:*
${itemsFormatted}
Please share payment details (UPI/GPay/Bank) and shipping timeline.

*My Shipping Address:*
Name: 
Address: 
Pincode & City: 
Phone: 

Thank you!`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${phone}?text=${encoded}`;
    window.open(waUrl, '_blank');
  },

  /**
   * Inquire about Custom Box on Instagram DM
   */
  inquireCustomBoxOnInstagram: function(size, selectedAttars, price) {
    const config = window.NURAAN_CONFIG || {};
    const igHandle = config.instagramHandle || "Nuraanperfumes";
    const currency = config.currencySymbol || "₹";

    if (!selectedAttars || selectedAttars.length === 0) {
      SocialCheckout.showToast("Please choose at least 1 attar for your custom box!", "error");
      return;
    }

    const summary = `Nuraan Perfumes Inquiry: Custom ${size} Discovery Box [${selectedAttars.join(', ')}] - ${currency}${price}`;

    SocialCheckout.copyToClipboard(summary, function() {
      SocialCheckout.showToast(`✓ Copied your ${selectedAttars.length}-attar custom box details! Opening @${igHandle}...`, "success");
      setTimeout(function() {
        window.open(`https://ig.me/m/${igHandle}`, '_blank');
      }, 750);
    });
  },

  /**
   * Order a Multi-Item Scent Selection List on WhatsApp
   */
  orderSelectionListOnWhatsApp: function(items, totalAmount) {
    const config = window.NURAAN_CONFIG || {};
    const phone = config.whatsappNumber || "918591059608";
    const brandName = config.brandName || "Nuraan Perfumes";
    const currency = config.currencySymbol || "₹";

    if (!items || items.length === 0) {
      SocialCheckout.showToast("Your Scent Selection is empty! Add attars to your list first.", "error");
      return;
    }

    let itemsFormatted = "";
    items.forEach((item, idx) => {
      const sizeTag = item.size === '12ml' ? '12ml Luxury Single' : '3ml Discovery Option';
      itemsFormatted += `  ${idx + 1}. *${item.name}* (${item.collection} Collection)\n     • Format: ${sizeTag} — ${currency}${item.price.toLocaleString('en-IN')}\n`;
    });

    const message = 
`✦ *NEW MULTI-ITEM ORDER — ${brandName.toUpperCase()}* ✦

Hello Nuraan Perfumes,
I would like to place an order for the following ${items.length} attars from your collection:

${itemsFormatted}
• *Total Items:* ${items.length} Bottles
• *Total Order Value:* ${currency}${totalAmount.toLocaleString('en-IN')}
• *Shipping:* Free Express All-India Dispatch

Please share your UPI / GPay / Bank details and confirm estimated delivery timeline.

*My Shipping Information:*
Name: 
Delivery Address: 
City & Pincode: 
Contact Phone: 

Thank you!`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${phone}?text=${encoded}`;
    window.open(waUrl, '_blank');
  },

  /**
   * Inquire about a Multi-Item Scent Selection List on Instagram DM
   */
  inquireSelectionListOnInstagram: function(items, totalAmount) {
    const config = window.NURAAN_CONFIG || {};
    const igHandle = config.instagramHandle || "Nuraanperfumes";
    const currency = config.currencySymbol || "₹";

    if (!items || items.length === 0) {
      SocialCheckout.showToast("Your Scent Selection is empty! Add attars to your list first.", "error");
      return;
    }

    const itemSummaries = items.map(item => `${item.name} (${item.size})`).join(", ");
    const summary = `Nuraan Perfumes Order List (${items.length} items • ${currency}${totalAmount.toLocaleString('en-IN')}): ${itemSummaries}`;

    SocialCheckout.copyToClipboard(summary, function() {
      SocialCheckout.showToast(`✓ Copied your ${items.length}-attar order list! Opening @${igHandle}...`, "success");
      setTimeout(function() {
        window.open(`https://ig.me/m/${igHandle}`, '_blank');
      }, 750);
    });
  },

  /**
   * General Concierge WhatsApp Assistance
   */
  openConciergeWhatsApp: function(customQuery = '') {
    const config = window.NURAAN_CONFIG || {};
    const phone = config.whatsappNumber || "918591059608";
    const defaultText = customQuery || 
`Hello Nuraan Perfumes,

I need some personalized fragrance guidance. Could you please recommend an attar based on my preferences?

Thank you!`;

    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(defaultText)}`;
    window.open(waUrl, '_blank');
  },

  copyToClipboard: function(text, callback) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(function() {
          if (callback) callback();
        })
        .catch(function() {
          SocialCheckout.fallbackCopy(text, callback);
        });
    } else {
      SocialCheckout.fallbackCopy(text, callback);
    }
  },

  fallbackCopy: function(text, callback) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      if (callback) callback();
    } catch (err) {
      console.error('Fallback clipboard error', err);
      if (callback) callback();
    }
    document.body.removeChild(textArea);
  },

  showToast: function(message, type = "info") {
    let container = document.getElementById("nuraan-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "nuraan-toast-container";
      container.className = "nuraan-toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `nuraan-toast nuraan-toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">✨</span>
        <span class="toast-message">${message}</span>
      </div>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }
};

window.SocialCheckout = SocialCheckout;
