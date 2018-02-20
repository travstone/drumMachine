# drumMachine

## Usage Notes

This implementation should play in the browser without any issue, and no server needed. That said, I've only tested in Chrome.


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


