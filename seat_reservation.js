document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("theaterCanvas");
    const context = canvas.getContext("2d");

    const seatSize = 40;
    const numRows = 8;
    const numSeatsPerRow = 10;
    const spacing = 10;
    const maxSeats = 5;

    // Added for highlighting
    let hoveredSeatRow = -1;
    let hoveredSeatIndex = -1;
    // Initialize selected seats array
    const selectedSeats = [];
    const seats = Array.from({ length: numRows }, () => Array(numSeatsPerRow).fill(true));

    // Set canvas size 
    canvas.width = numSeatsPerRow * (seatSize + spacing);
    canvas.height = numRows * (seatSize + spacing);

    const reservationForm = document.getElementById("reservationForm");
    const selectedSeatInput = document.getElementById("selectedSeat");
    const urlParams = new URLSearchParams(window.location.search);
    const movie = urlParams.get('movie');

      // Display the selected movie's information
      if (movie) {
        const movieInfoElement = document.getElementById('selected-movie-info');
        if (movieInfoElement) {
          // Update the element's content with the movie information
          movieInfoElement.innerHTML = `<h3>${movie}</h3>`;
        }
      }
    // Display the movie information
    window.onload = function() {
        var params = new URLSearchParams(window.location.search);
        var title = params.get('title');
        var time = params.get('time');

        if (title && time) {
            document.getElementById('selectedMovieTitle').textContent = title + " : " + time;
            
        }
    };

    // Get the confirm button
    var confirmButton = document.getElementById("confirmPurchase");

    // Function to handle the confirm action
    function handleConfirm() {
        // Update the modal text to show confirmation
        var confirmationMessageElement = document.getElementById('confirmationMessage');
        confirmationMessageElement.textContent = 'Your seats have been confirmed!';
        
        setTimeout(function() {
            modal.style.display = "none";
        }, 2000); // 2 second delay before closing
    }

    // Attach the event listener to the confirm button
    document.getElementById('confirmPurchase').addEventListener('click', handleConfirm);
    document.getElementById('homeButton').addEventListener('click', function() {
        window.location.href = 'Theater.html';
    });

    function handleSeatSelection(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Calculate the seat clicked on
        const selectedRow = Math.floor(mouseY / (seatSize + spacing));
        const selectedSeat = Math.floor(mouseX / (seatSize + spacing));
        // Calculate if clicked within seat
        const xWithinSeat = mouseX % (seatSize + spacing);
        const yWithinSeat = mouseY % (seatSize + spacing);
            
        // Determine if click is within bounds of seat.
        if (xWithinSeat < seatSize && yWithinSeat < seatSize) {
            const isSelected = seats[selectedRow][selectedSeat]; // Determine if the seat is already selected

            if (isSelected && selectedSeats.length < maxSeats) {
                // If constraint on seats is not reached allow for its selection
                seats[selectedRow][selectedSeat] = false; // Mark seat as selected
                selectedSeats.push({ row: selectedRow, seat: selectedSeat });
            } else if (!isSelected) {
                // If seat is selected unselect it
                seats[selectedRow][selectedSeat] = true; // Mark seat as available
                const indexToRemove = selectedSeats.findIndex(
                    (seat) => seat.row === selectedRow && seat.seat === selectedSeat
                );
                if (indexToRemove !== -1) {
                    selectedSeats.splice(indexToRemove, 1);
                }
            }
            drawTheater();
            // Update the form input field with selected seat IDs
            const selectedSeatIds = selectedSeats.map(({ row, seat }) => {
                const rowLabel = String.fromCharCode('A'.charCodeAt(0) + row);
                const seatNumber = seat + 1;
                return rowLabel + seatNumber;
            });

            selectedSeatInput.value = selectedSeatIds.join(', ');
        }
    }

    // Click event for seat selection
    canvas.addEventListener("click", handleSeatSelection);

    function updateSeatNumberOptions() {
        // Seat selection options
        const seatNumberSelect = document.getElementById("seatNumber");
        // Clear any existing options
        seatNumberSelect.innerHTML = '';

        seats.forEach((row, rowIndex) => {
            row.forEach((seat, seatIndex) => {
                // Only add an option if the seat is available
                if (seat) {
                    // Create the seat ID by combining row and columne
                    const rowLabel = String.fromCharCode('A'.charCodeAt(0) + rowIndex);
                    const seatNumber = seatIndex + 1; // Seat numbers start at 1
                    const seatId = rowLabel + seatNumber;

                    // Create a new option element for the seat
                    const option = document.createElement('option');
                    option.value = seatId;
                    option.text = seatId;

                    // Add the new option to the dropdown
                    seatNumberSelect.appendChild(option);
                }
            });
        });
    }

    // Call drawTheater to initially draw the theater
    drawTheater();

    // Call updateSeatNumberOptions to populate the dropdown
    updateSeatNumberOptions();
    // Add row labels to the rowLabelsContainer
    const rowLabelsContainer = document.getElementById("rowLabelsContainer");
    for (let row = 0; row < numRows; row++) {
        const rowLabel = String.fromCharCode('A'.charCodeAt(0) + row);
        const rowLabelElement = document.createElement('div');
        rowLabelElement.textContent = rowLabel;
        rowLabelsContainer.appendChild(rowLabelElement);
    }

    // Add column labels to the columnLabelsContainer
    const columnLabelsContainer = document.getElementById("columnLabelsContainer");
    for (let seat = 0; seat < numSeatsPerRow; seat++) {
        const colLabel = (seat + 1).toString();
        const colLabelElement = document.createElement('div');
        colLabelElement.textContent = colLabel;
        columnLabelsContainer.appendChild(colLabelElement);
    }

    function drawTheater() {
        // Clear the entire canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Set a new color for the seat labels
        const labelColor = '#FF6347'; // Example: Tomato Red color

        // Set font for the labels
        context.font = "14px Arial";
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.fillStyle = labelColor; // Use the new color for the text

        // Drawing row labels
        for (let row = 0; row < numRows; row++) {
            const rowLabel = String.fromCharCode('A'.charCodeAt(0) + row);
            const y = (row * (seatSize + spacing)) + (seatSize / 2);
            context.fillText(rowLabel, 10, y);
        }

        // Drawing column labels
        for (let seat = 0; seat < numSeatsPerRow; seat++) {
            const colLabel = (seat + 1).toString();
            const x = (seat * (seatSize + spacing)) + (seatSize / 2);
            const y = 10;
            context.fillText(colLabel, x, y);
        }

        // Color seats
        context.fillStyle = '#00FF00'; 
        // Draw seats with borders
        for (let row = 0; row < numRows; row++) {
            for (let seat = 0; seat < numSeatsPerRow; seat++) {
                const x = seat * (seatSize + spacing);
                const y = row * (seatSize + spacing);

                // Set the fillStyle based on the seat state before drawing
                context.fillStyle = seats[row][seat] ? '#00FF00' : '#FF0000'; // Green for available, Red for taken

                // Draw the seat rectangle
                context.fillRect(x + 2, y + 2, seatSize - 4, seatSize - 4);

                // Check if the seat is currently hovered
                if (row === hoveredSeatRow && seat === hoveredSeatIndex) {
                    // Draw a clear highlight around the seat
                    context.strokeStyle = '#00FFFF'; // Example color for the highlight (cyan)
                    context.lineWidth = 2;
                    context.strokeRect(x, y, seatSize, seatSize);
                } else {
                    // Draw the seat border
                    context.strokeStyle = '#000000'; // Example color for the border (black)
                    context.lineWidth = 1;
                    context.strokeRect(x, y, seatSize, seatSize);
                }
            }
        }
    }
});
