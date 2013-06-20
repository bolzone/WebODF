/**
 * @license
 * Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>
 *
 * @licstart
 * The JavaScript code in this page is free software: you can redistribute it
 * and/or modify it under the terms of the GNU Affero General Public License
 * (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.  The code is distributed
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.
 *
 * As additional permission under GNU AGPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * As a special exception to the AGPL, any HTML file which merely makes function
 * calls to this code, and for that purpose includes it by reference shall be
 * deemed a separate work for copyright law purposes. In addition, the copyright
 * holders of this code give you permission to combine this code with free
 * software libraries that are released under the GNU LGPL. You may copy and
 * distribute such a system following the terms of the GNU AGPL for this code
 * and the LGPL for the libraries. If you modify this code, you may extend this
 * exception to your version of the code, but you are not obligated to do so.
 * If you do not wish to do so, delete this exception statement from your
 * version.
 *
 * This license applies to this entire compilation.
 * @licend
 * @source: http://www.webodf.org/
 * @source: http://gitorious.org/webodf/webodf/
 */

/*global ops*/

/**
 * @constructor
 * @implements ops.Operation
 */
ops.OpCloneParagraphStyle = function OpCloneParagraphStyle() {
    "use strict";

    var memberid, timestamp, styleName, newStyleName, newStyleDisplayName,
        /** @const */stylens = "urn:oasis:names:tc:opendocument:xmlns:style:1.0";

    this.init = function (data) {
        memberid = data.memberid;
        timestamp = data.timestamp;
        styleName = data.styleName;
        newStyleName = data.newStyleName;
        newStyleDisplayName = data.newStyleDisplayName;
    };

    this.execute = function (odtDocument) {
        var styleNode = odtDocument.getParagraphStyleElement(styleName),
            newStyleNode;

        if (!styleNode) {
            return false;
        }

        newStyleNode = styleNode.cloneNode(true);
        newStyleNode.setAttributeNS(stylens, 'style:name', newStyleName);
        // style:display-name can be unset, will default to style:name in that case, see ODF 1.2 § 19.472
        if (newStyleDisplayName) {
            newStyleNode.setAttributeNS(stylens, 'style:display-name', newStyleDisplayName);
        } else {
            // remove any cloned display-name
            newStyleNode.removeAttributeNS(stylens, 'display-name');
        }
        styleNode.parentNode.appendChild(newStyleNode);

        odtDocument.getOdfCanvas().refreshCSS();
        odtDocument.emit(ops.OdtDocument.signalStyleCreated, newStyleName);
        return true;
    };

    this.spec = function () {
        return {
            optype: "CloneParagraphStyle",
            memberid: memberid,
            timestamp: timestamp,
            styleName: styleName,
            newStyleName: newStyleName,
            newStyleDisplayName: newStyleDisplayName
        };
    };
};
