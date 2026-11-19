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
    const igHandle = config.instagramHandle || "nuraan_perfumes";
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
   * Order a Curated Gift Set on WhatsApp with Multi-Box Volume Tier Support
   */
  orderComboOnWhatsApp: function(combo, bundleQty = 1) {
    const config = window.NURAAN_CONFIG || {};
    const phone = config.whatsappNumber || "918591059608";
    const brandName = config.brandName || "Nuraan Perfumes";
    const currency = config.currencySymbol || "₹";

    const qty = Number(bundleQty) || 1;
    let activePrice = 999;
    let activeMRP = 2499;
    let tierNote = "Standard Luxury Gift Coffret Offer";

    if (qty === 2) {
      activePrice = 1699;
      activeMRP = 4998;
      tierNote = "✦ Special Bundle: 30% Off 2nd Box (Save ₹3,299)";
    } else if (qty === 4) {
      activePrice = 2999;
      activeMRP = 9996;
      tierNote = "👑 VIP Offer: Buy 3, Get 1 FREE (Save ₹6,997)";
    } else if (qty > 1) {
      activePrice = qty * 999;
      activeMRP = qty * 2499;
    }

    const formatName = `${qty} × (6 × 3ml Precision Roll-on Luxury Gift Coffret)`;
    const itemsList = combo.itemsIncluded ? combo.itemsIncluded.join(", ") : "";

    const message = 
`✦ *GIFT SET ORDER — ${brandName.toUpperCase()}* ✦

Hello Nuraan Perfumes,
I would like to order this curated Gift Set offer:

• *Set Name:* ${combo.name}
• *Quantity:* ${qty} Gift Set${qty > 1 ? 's' : ''}
• *Format:* ${formatName}
• *Offer Applied:* ${tierNote}
• *Attars in Set:* ${itemsList}
• *Total Payable:* ${currency}${activePrice.toLocaleString('en-IN')} (MRP: ${currency}${activeMRP.toLocaleString('en-IN')})
• *Shipping:* Free Express All-India Dispatch

Please share your UPI / GPay details and estimated dispatch schedule.

*Shipping Information:*
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
   * Inquire about a Curated Gift Set on Instagram DM
   */
  inquireComboOnInstagram: function(combo, bundleQty = 1) {
    const config = window.NURAAN_CONFIG || {};
    const igHandle = config.instagramHandle || "nuraan_perfumes";
    const currency = config.currencySymbol || "₹";

    const qty = Number(bundleQty) || 1;
    let activePrice = 999;
    if (qty === 2) activePrice = 1699;
    else if (qty === 4) activePrice = 2999;
    else if (qty > 1) activePrice = qty * 999;

    const formatLabel = `${qty} × 6 × 3ml Luxury Gift Set${qty > 1 ? 's' : ''}`;
    const summary = `Nuraan Perfumes Order: ${combo.name} (${formatLabel}) - ${currency}${activePrice.toLocaleString('en-IN')}`;

    SocialCheckout.copyToClipboard(summary, function() {
      SocialCheckout.showToast(`✓ Copied "${combo.name} (${formatLabel})" details! Opening @${igHandle}...`, "success");
      setTimeout(function() {
        window.open(`https://ig.me/m/${igHandle}`, '_blank');
      }, 750);
    });
  },

  /**
   * Order a Custom "Build Your Own" Gift Set on WhatsApp
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

    const activePrice = price || config.customBox3mlPrice || 999;

    const message = 
`✦ *BESPOKE CUSTOM GIFT SET — ${brandName.toUpperCase()}* ✦

Hello Nuraan Perfumes,
I have customized my own Attar Gift Set with the following ${selectedAttars.length} attars:

• *Box Format:* Custom 6 × 3ml Precision Roll-on Gift Coffret
• *Special Price:* ${currency}${activePrice.toLocaleString('en-IN')} (MRP: ₹2,499)

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
   * Inquire about Custom Gift Set on Instagram DM
   */
  inquireCustomBoxOnInstagram: function(size, selectedAttars, price) {
    const config = window.NURAAN_CONFIG || {};
    const igHandle = config.instagramHandle || "nuraan_perfumes";
    const currency = config.currencySymbol || "₹";

    if (!selectedAttars || selectedAttars.length === 0) {
      SocialCheckout.showToast("Please choose at least 1 attar for your custom box!", "error");
      return;
    }

    const activePrice = price || config.customBox3mlPrice || 999;
    const summary = `Nuraan Perfumes Inquiry: Custom 6 × 3ml Gift Set [${selectedAttars.join(', ')}] - ${currency}${activePrice}`;

    SocialCheckout.copyToClipboard(summary, function() {
      SocialCheckout.showToast(`✓ Copied your ${selectedAttars.length}-attar custom gift set details! Opening @${igHandle}...`, "success");
      setTimeout(function() {
        window.open(`https://ig.me/m/${igHandle}`, '_blank');
      }, 750);
    });
  },

  /**
   * Unified Cart Volume Discounts & Bundle Calculation Engine
   * • 12ml Wardrobe Gamification:
   *   1-2 bottles: 0% discount
   *   3 bottles: 15% discount
   *   4 bottles: 20% discount
   *   5 bottles: 25% discount
   *   6+ bottles: 30% discount + Shipped in Bespoke 6-Bottle Luxury Presentation Coffret (₹67 box included free)
   * • Universal Gift Set Cross-Set Bundling:
   *   1 set: ₹999
   *   2 sets: ₹1,699 (30% off 2nd box — saves ₹299)
   *   3 sets: ₹2,698 (nudge to add 4th)
   *   4 sets: ₹2,999 (Buy 3, Get 1 FREE — saves ₹997)
   *   5+ sets: ₹2,999 + (n - 4) * ₹750
   */
  calculateCartSummary: function(items) {
    const list = items || [];
    const bottles12ml = [];
    const giftSets = [];
    const otherItems = [];

    list.forEach(item => {
      const isSet = Boolean(
        item.isGiftSet || 
        item.isCombo || 
        (item.size && (item.size.toLowerCase().includes('set') || item.size.toLowerCase().includes('coffret') || item.size.toLowerCase().includes('box'))) ||
        (item.name && item.name.toLowerCase().includes('gift set'))
      );

      if (isSet) {
        giftSets.push(item);
      } else if (item.size === '12ml') {
        bottles12ml.push(item);
      } else {
        otherItems.push(item);
      }
    });

    // 1. 12ml bottles calculations
    const n12 = bottles12ml.length;
    const subtotal12ml = bottles12ml.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
    let disc12Pct = 0;
    let disc12Label = '';

    if (n12 >= 6) {
      disc12Pct = 0.30;
      disc12Label = '30% Off (6-Bottle Luxury Wardrobe Coffret Tier)';
    } else if (n12 === 5) {
      disc12Pct = 0.25;
      disc12Label = '25% Off (5-Bottle Wardrobe Tier)';
    } else if (n12 === 4) {
      disc12Pct = 0.20;
      disc12Label = '20% Off (4-Bottle Wardrobe Tier)';
    } else if (n12 === 3) {
      disc12Pct = 0.15;
      disc12Label = '15% Off (3-Bottle Wardrobe Tier)';
    }

    const disc12Amount = Math.round(subtotal12ml * disc12Pct);
    const payable12ml = subtotal12ml - disc12Amount;

    // 2. Gift sets calculations (Universal pooling across all variants)
    const nSets = giftSets.length;
    const subtotalSets = nSets * 999;
    let payableSets = 0;
    let discSetsLabel = '';

    if (nSets === 0) {
      payableSets = 0;
    } else if (nSets === 1) {
      payableSets = 999;
      discSetsLabel = 'Standard Gift Set Offer';
    } else if (nSets === 2) {
      payableSets = 1699;
      discSetsLabel = '30% Off 2nd Box (2-Set Bundle Offer)';
    } else if (nSets === 3) {
      payableSets = 2698;
      discSetsLabel = '2-Set Bundle + 1 Box';
    } else if (nSets === 4) {
      payableSets = 2999;
      discSetsLabel = '👑 Buy 3, Get 1 FREE (Complete 4-Set Collection)';
    } else {
      payableSets = 2999 + ((nSets - 4) * 750);
      discSetsLabel = `Complete 4-Set Collection + ${nSets - 4} Extra @ ₹750/ea`;
    }

    const discSetsAmount = subtotalSets - payableSets;

    // 3. Other items
    const subtotalOther = otherItems.reduce((sum, o) => sum + (Number(o.price) || 0), 0);

    const grossSubtotal = subtotal12ml + subtotalSets + subtotalOther;
    const totalDiscount = disc12Amount + discSetsAmount;
    const finalPayable = payable12ml + payableSets + subtotalOther;

    return {
      bottles12ml,
      giftSets,
      otherItems,
      n12,
      nSets,
      subtotal12ml,
      disc12Pct,
      disc12Label,
      disc12Amount,
      payable12ml,
      subtotalSets,
      discSetsAmount,
      discSetsLabel,
      payableSets,
      grossSubtotal,
      totalDiscount,
      finalPayable
    };
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

    const summary = SocialCheckout.calculateCartSummary(items);

    let itemsFormatted = "";
    items.forEach((item, idx) => {
      const isSet = Boolean(
        item.isGiftSet || 
        item.isCombo || 
        (item.size && (item.size.toLowerCase().includes('set') || item.size.toLowerCase().includes('coffret') || item.size.toLowerCase().includes('box'))) ||
        (item.name && item.name.toLowerCase().includes('gift set'))
      );
      const sizeTag = isSet ? '6 × 3ml Precision Coffret' : (item.size === '12ml' ? '12ml Precision Roll-on' : '3ml Discovery Option');
      const unitP = item.price || (isSet ? 999 : 499);
      itemsFormatted += `  ${idx + 1}. *${item.name}* (${sizeTag}) — ${currency}${unitP.toLocaleString('en-IN')}\n`;
    });

    let discountBreakdown = "";
    if (summary.totalDiscount > 0) {
      discountBreakdown += `\n• *Gross Subtotal:* ${currency}${summary.grossSubtotal.toLocaleString('en-IN')}\n`;
      if (summary.disc12Amount > 0) {
        discountBreakdown += `• *12ml Wardrobe Discount (${summary.disc12Label}):* -${currency}${summary.disc12Amount.toLocaleString('en-IN')}\n`;
      }
      if (summary.discSetsAmount > 0) {
        discountBreakdown += `• *Gift Set Bundle Savings (${summary.discSetsLabel}):* -${currency}${summary.discSetsAmount.toLocaleString('en-IN')}\n`;
      }
    }

    let packagingNote = "";
    if (summary.n12 >= 6) {
      packagingNote = "• *Packaging:* Shipped in our Bespoke 6-Bottle Luxury Presentation Coffret (Included Free)\n";
    }

    const countDetails = [];
    if (summary.n12 > 0) countDetails.push(`${summary.n12} × 12ml Bottles`);
    if (summary.nSets > 0) countDetails.push(`${summary.nSets} × Gift Sets`);
    if (summary.otherItems.length > 0) countDetails.push(`${summary.otherItems.length} × Other Items`);

    const message = 
`✦ *NEW MULTI-ITEM ORDER — ${brandName.toUpperCase()}* ✦

Hello Nuraan Perfumes,
I would like to place an order for the following items:

${itemsFormatted}
• *Total Items:* ${items.length} Product${items.length > 1 ? 's' : ''} (${countDetails.join(', ')})${discountBreakdown}
${packagingNote}• *Total Payable:* ${currency}${summary.finalPayable.toLocaleString('en-IN')}
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
    const igHandle = config.instagramHandle || "nuraan_perfumes";
    const currency = config.currencySymbol || "₹";

    if (!items || items.length === 0) {
      SocialCheckout.showToast("Your Scent Selection is empty! Add attars to your list first.", "error");
      return;
    }

    const summary = SocialCheckout.calculateCartSummary(items);
    const itemSummaries = items.map(item => `${item.name} (${item.size || '3ml'})`).join(", ");
    const summaryText = `Nuraan Perfumes Order List (${items.length} items • ${currency}${summary.finalPayable.toLocaleString('en-IN')}): ${itemSummaries}`;

    SocialCheckout.copyToClipboard(summaryText, function() {
      SocialCheckout.showToast(`✓ Copied your order list details! Opening @${igHandle}...`, "success");
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
