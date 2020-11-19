import sublime
import sublime_plugin

####################################################################################################
#                                         Common Function                                          #
####################################################################################################
def create_replacement(linetext, length, lang):
	output = ""
	effective_text = linetext.strip()

	########################################
	#             Indentation              #
	########################################
	spacing = ""
	for i in range (len(linetext)):
		if linetext[i] != effective_text[0]:
			spacing += linetext[i]
		else:
			break

	########################################
	#         Left & Right spacing         #
	########################################
	distance_length = (length - len(effective_text) - 2) / 2
	distance_left = ""
	distance_right = ""
	if distance_length.is_integer():
		tmp_num = int(distance_length)
		distance_left = " " * tmp_num
		distance_right = distance_left
	else:
		tmp_num1 = int(distance_length)
		tmp_num2 = tmp_num1 + 1
		distance_left = " " * tmp_num1
		distance_right = " " * tmp_num2

	###################################################
	# Different output depending on lanugage comments #
	###################################################

	if "python" in lang.lower():
		hashes = "#" * length
		output = spacing + hashes + "\n" + spacing + "#" + distance_left + effective_text + distance_right + "#\n" + spacing + hashes + "\n"
	else: # Assuming other programming languages have /* ... */
		stars = "*" * (length - 1)
		output = spacing + "/" + stars + "\n" + spacing + " *" + distance_left + effective_text + distance_right[:-1] + "*\n " + spacing + stars + "/\n"

	return output


####################################################################################################
#                                             Commands                                             #
####################################################################################################
class AddSectionCommentLongCommand(sublime_plugin.TextCommand):
	def run(self, edit):
		########################################
		#            Initialisation            #
		########################################

		sels = self.view.sel()
		cursor1 = sels[0]
		startPos = cursor1.begin()
		syntax = self.view.settings().get("syntax")
		linetext = self.view.substr(self.view.line(self.view.sel()[0]))

		########################################
		#          Generate & Replace          #
		########################################

		output = create_replacement(linetext, 100, syntax)
		self.view.replace(edit, self.view.line(startPos), output)

class AddSectionCommentShortCommand(sublime_plugin.TextCommand):
	def run(self, edit):
		########################################
		#            Initialisation            #
		########################################

		sels = self.view.sel()
		cursor1 = sels[0]
		startPos = cursor1.begin()
		syntax = self.view.settings().get("syntax")		
		linetext = self.view.substr(self.view.line(self.view.sel()[0]))

		########################################
		#          Generate & Replace          #
		########################################

		output = create_replacement(linetext, 40, syntax)
		self.view.replace(edit, self.view.line(startPos), output)
