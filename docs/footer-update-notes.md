# Footer cleanup and oval D badges

The footer keeps all 3 navigation categories, all 16 category links, and 24 link/button actions after the user requested removing the standalone DIESEL wordmark and “Diesel is part of OTB” link. The large “For successful / living.” statement, its supporting copy, SINCE 1978, and the author credit are removed. The old denim background asset remains available to the earlier story sections.

The reference is the [SAKAZUKI footer](https://sakazuki.io/): a black background, small navigation near the bottom, physical objects that collide and settle, and black backing behind individual links. Desktop uses four aligned link columns; mobile uses a two-column Explore list followed by the two support categories. Existing social, policy, region, OTB Foundation, and back-to-top actions remain available. The standalone wordmark and OTB credit link are removed.

## Badge asset

- Saved asset: [`assets/footer-oval-d.png`](../assets/footer-oval-d.png)
- Mode: built-in `image_gen`, edit / background extraction, transparent background.
- Input: the user's attached photograph of the oval D metal buckle.
- Output: 1569 × 1002 RGBA PNG. Alpha content bounds used for canvas drawing: `69, 73, 1447, 867`.
- The output is a generated extraction and completion of the source photograph, including the originally clipped left rim.

Final prompt:

> Use case: background-extraction. Asset type: transparent photographic sprite for a Diesel website footer. Input image: the last user-attached photograph of the dark chrome oval D metal buckle, as the edit target. Extract only the entire oval metal badge from that photograph. Remove the white background and the red-and-white reflected object underneath completely. Preserve the recognizable oval D design, gunmetal finish, silver rim, inset black leather-like surface, and the original oblique camera angle. Where the left edge was cut off in the source, complete the same oval rim naturally so the whole single badge is visible. Center the badge with a modest transparent margin. Actual transparent alpha outside the object, clean antialiased edges, no floor, no background, no cast shadow outside the badge, no added text or extra objects. Keep this as faithful product photography, not an illustration.

## Physics

The local [Matter.js 0.20.0](https://github.com/liabru/matter-js/tree/0.20.0) build is saved at `assets/vendor/matter.min.js` with its MIT license at `assets/vendor/matter.LICENSE`. It is loaded near the footer rather than requested from an external CDN at runtime.

The badges are arranged into an irregular pile before the canvas is shown. There is no visible falling introduction or looping sway. The photographed metal texture remains intact. Passing the desktop pointer over a piece applies a small, bounded force at the actual contact point. The supported body rocks slightly while gravity and friction keep the pile grounded. Each body has a 140ms contact cooldown; no separate visual transform moves a piece away from its collision body.

Desktop dragging also moves an actual rigid body. Its target follows through a damped, speed-limited path, with bounded stretch and body velocities so surrounding pieces do not fly upward. Nearby pieces push against each other and settle with gravity, friction, and low rebound. Release removes the dragged piece's excess velocity. Settled bodies sleep and stop rendering until the next interaction. This uses the interaction model observed in the reference's [public footer code](https://sakazuki.io/_next/static/chunks/c9e8c4bbc5bc5ef3.js), adapted for heavier metal badges and a restrained pointer contact response.

Links render above the decorative canvas. Motion pauses outside the viewport and in hidden tabs; reduced motion and unavailable physics use a static badge arrangement. Normal wheel and touch scrolling remain available.
