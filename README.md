# drumMachine

## Repo Branches/Usage Notes

There are three branches to this repo:

- [master](https://github.com/travstone/drumMachine): this is the initial development, accomplished in about 4 hours. This implementation should play in the browser with no server needed.
- [visDes](https://github.com/travstone/drumMachine/tree/visDes): next, I added some basic rough styling in this branch; spent an hour or so on it. This implementation should play in the browser with no server needed.
- [webAudio](https://github.com/travstone/drumMachine/tree/webAudio): after that, I folded in working audio; this took another hour or two. This implementation requires a server (AJAX doesn't like to work via the file:// protocol). Even something simple like [Mongoose](https://cesanta.com/) should work (possibly with a bit of config).


For all of these branches I've only tested in Chrome, but should probably work in FF... possibly not in IE.


## Post-development thoughts

As noted below, I didn't research any of the design/architecture before starting. After finishing with the `webAudio` branch, I did go and look at other implementations of a drum machine. After reviewing these other approaches, I'd probably consider refactoring this to use the timing available in the Web Audio API (as oppsed to just setTimeout); it seems like this may offer a more precise clock.

I also did not tackle the problem of how to handle patterns that differ in length from the master (e.g. an 8-step pattern looping in a 16-step sequence). To handle this, I'd be inclined to consider both my initial thought of stepping thru the pattern arrays without using the indexes, or some approach that calculates the correct index for the shorter sequence in the context of the master sequence length. I'm not sure at this point if there's a reason to favor either approach, nor am I certain that these are the only viable approaches.

<hr />
*The rest of this was written prior to getting started with any coding*

## Initial Thoughts

I've never implemented a drum machine in code before.

As with many things that I haven't done before, my first inclination is to have a look around and see if others have posted about how they tackled the problem.

In the interest of showing my own thought process, I'll first sketch out my own approach. Afterward I may do a survey to see if I can glean any insights to improve whatever I come up with.

As an aside, I bought my first drum machine when I was about 14 or 15... a TR-505.

## Conceptual

There are a few main components of this:

- Generating a tempo
- Superimposing arbitrary patterns in the context of a given tempo
- Rendering the superimposed patterns visually and audibly
- Allowing the tempo to be changed, optimally in real time
- Allowing the patterns to be changed, optimally in real time

First and foremost, a drum machine keeps time. So I need to devise a process that:

- Observes a specific tempo and triggers sounds at the appropriate intervals
- Respects the tempo in real time, i.e. responds to tempo changes as they happen
- Loops back around according to the master pattern length
- While also correctly looping patterns of varying lengths within the context of the master loop

The triggered sounds form a pattern. I need to devise a way to represent this pattern in code.

- Cannot be fixed at run time; must be editable in real time
- Multiple sounds can occur at once
- The pattern length of any individual sound can be shorter than the master loop (so can't just use a single array for all of the sounds?)
- Ideally the values that defines when a note is on can also indicate the amplitude of the note

The tempo and patterns must be rendered visually

- Show the tempo numerically; make it editable
- Indicate the current step of the master loop
- Indicate the note on/off for each step of each sound
- Ideally show in each sound/step when a note fires (matching the current step of the master loop)


## Architectural

- core loop: driven by setInterval()? or would setTimeout() make it easier to set the tempo on the fly? Is there a better way? I feel like the math will be clearer if we avoid Raf for the core loop (just use it for rendering)
- core loop: call a function for each step? I think we'd want to avoid emitting an event for this (in the interest of timing accuracy)
- core loop: at each step, advance sound pattern(s) by one. It seems like using an array and array methods would be the right approach here (would make it easier to loop back around for sound patterns shorter than the master loop, I think)


