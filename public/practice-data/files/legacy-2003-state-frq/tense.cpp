/**********************************
 ** File:       change3.c	   **
 ** Programmer: Marc Douet       **
 ** Date:       03/27/02         **
 **********************************/

#include <stdio.h>
#include <string.h>

#define  MAX_SENTENCE_LEN  201
#define  NUM_SENTENCES     3


/**********************
 ** Global Variables **
 **********************/

char    Sentences[NUM_SENTENCES][MAX_SENTENCE_LEN];

/***************************************************************************
 * Function:  ReadSentences
 *
 * Synopsis:  void ReadSentences(void)
 *
 * Description:  Read in all sentences from standard input and sticks them
 *               in the global 'Sentences' array.
 *
 * Return Value:  None.
 ***************************************************************************/
void ReadSentences()
{

  int    letterIndex, sentenceIndex;
  char   sentenceList[MAX_SENTENCE_LEN*NUM_SENTENCES];
  char  *sentenceListPtr = sentenceList;
  char  *sentencePtr = NULL;

  /* 
   * Null out all of the sentences on the sentences list.
   */
  for(sentenceIndex = 0; sentenceIndex < NUM_SENTENCES; sentenceIndex++) {
      for(letterIndex = 0; letterIndex < MAX_SENTENCE_LEN; letterIndex++) {
          Sentences[sentenceIndex][letterIndex] = '\0';
      }
  }

  /*
   * Null out the array that we are using to read in the sentences.
   */
  for(letterIndex = 0; letterIndex < MAX_SENTENCE_LEN; letterIndex++) {
      sentenceList[letterIndex] = '\0';
  }

  /*
   * Read in all of the sentences.
   */
  fgets(sentenceList, sizeof(sentenceList), stdin);

  /* 
   * Parse out all of the sentences (sentences are delimited by a period).
   */
  for(sentenceIndex = 0; sentenceIndex < NUM_SENTENCES; sentenceIndex++) {
      sentencePtr = strtok(sentenceListPtr, ".");
      sprintf(Sentences[sentenceIndex], "%s", sentencePtr);
      sentenceListPtr = NULL;
  }
}


/***************************************************************************
 * Function:  PrintVerb
 *
 * Synopsis:  void PrintVerb(char *sentence)
 *
 * Description:  Parse out the verb phrase from the sentence and print it.
 *
 * Return Value:  None.
 ***************************************************************************/
void PrintVerb(char *sentence, int PrintComma)
{
  char   savedSentence[MAX_SENTENCE_LEN];
  char   willString[5];
  char   haveString[5];
  char  *word           = NULL,
        *prevWord       = NULL,
        *sentencePtr    = sentence;
  int    FoundWill      = FALSE,
         FoundHave      = FALSE,
         wordIndex      = -1,
         foundWillIndex = -2,
         foundHaveIndex = -2,
         index;

  /* 
   * Null out strings used for saving words 'will' and 'have'.
   */
  for(index = 0; index < 5; index++) {
      willString[index] = '\0';
      haveString[index] = '\0';
  }

  /*
   * Save off a copy of the sentence since strtok() will mutulate it.
   */
  sprintf(savedSentence, "%s", sentence);

  /*
   * IF the verb phrase "will have <foo>ed" was found, print it and exit.
   */
  while((word = strtok(sentencePtr, " ")) != NULL) {
      wordIndex++;
      sentencePtr = NULL;

      if((!FoundWill) && (!strcasecmp(word, "will"))) {
          foundWillIndex = wordIndex;
          sprintf(willString, "%s", word);
          FoundWill = TRUE;
      }

      else if((FoundWill) && (!FoundHave) && (!strcasecmp(word, "have")) 
              && (wordIndex == (foundWillIndex+1))) {
          foundHaveIndex = wordIndex;
          sprintf(haveString, "%s", word);
          FoundHave = TRUE;
      }

      else if((FoundWill) && (FoundHave)) {
          if((!strcasecmp(&word[strlen(word)-2], "ed")) 
                  && (wordIndex == (foundHaveIndex+1))) {
               if(PrintComma) {
                   printf(",");
               }

               printf("%s %s %s", willString, haveString, word);
               return;
          }
      }
  }

  /*
   * ELSE IF the verb phrase "have <foo>ed" was found, print it and exit.
   */
  sprintf(sentence, "%s", savedSentence);
  sentencePtr = sentence;
  FoundWill = FALSE,
  FoundHave = FALSE,
  wordIndex = -1,
  foundWillIndex = -2,
  foundHaveIndex = -2;
  while((word = strtok(sentencePtr, " ")) != NULL) {
      wordIndex++;
      sentencePtr = NULL;

      if((!FoundHave) && (!strcasecmp(word, "have"))) {
          foundHaveIndex = wordIndex;
          sprintf(haveString, "%s", word);
          FoundHave = TRUE;
      }

      else if((FoundHave)) {
          if((!strcasecmp(&word[strlen(word)-2], "ed"))
                  && (wordIndex == (foundHaveIndex+1))) {
               if(PrintComma) {
                   printf(",");
               }

               printf("%s %s", haveString, word);
               return;
          }
      }
  }

  /*
   * ELSE IF the verb phrase "<foo>ed" was found, print it and exit.
   */
  sprintf(sentence, "%s", savedSentence);
  sentencePtr = sentence;
  while((word = strtok(sentencePtr, " ")) != NULL) {
      sentencePtr = NULL;

      if((!strcasecmp(&word[strlen(word)-2], "ed"))) {
          if(PrintComma) {
              printf(",");
          }

          printf("%s", word);
          return;
      }
  }

  /*
   * ELSE IF the verb phrase "<foo> <foo>ing" was found, print it and exit.
   */
  sprintf(sentence, "%s", savedSentence);
  sentencePtr = sentence;
  prevWord = NULL;
  while((word = strtok(sentencePtr, " ")) != NULL) {
      sentencePtr = NULL;

      /* 
       * If we found a word ending in 'ing' and there was a word before it,
       * print both words.
       */
      if((!strcasecmp(&word[strlen(word)-3], "ing")) && (prevWord != NULL)) {
          if(PrintComma) {
              printf(",");
          }

          printf("%s %s", prevWord, word);
          return;
      }
      
      prevWord = word;
  }

  /*
   * ELSE IF the verb phrase "will <foo>" was found, print it and exit.
   */
  sprintf(sentence, "%s", savedSentence);
  sentencePtr = sentence;
  while((word = strtok(sentencePtr, " ")) != NULL) {
      sentencePtr = NULL;

      if((!FoundWill) && (!strcasecmp(word, "will"))) {
          sprintf(willString, "%s", word);
          FoundWill = TRUE;
      }

      else if((FoundWill)) {
          if(PrintComma) {
              printf(",");
          }

          printf("%s %s", willString, word);
          return;
     }
  }

  /*
   * ELSE none of the other cases occured, so just print the last word in the sentence.
   */
  sprintf(sentence, "%s", savedSentence);
  sentencePtr = sentence;
  prevWord = NULL;
  while((word = strtok(sentencePtr, " ")) != NULL) {
      sentencePtr = NULL;
      prevWord = word;
  }

  if(prevWord == NULL) {
      printf("Error, failed to find the last word in the sentence!\n");
      exit(1);
  }

  /* 
   * Found the last word, so print it since he has to be the verb phrase.
   */
  if(PrintComma) {
      printf(",");
  }

  printf("%s", prevWord);
}


/***************************************************************************
* Function:  main
*
* Synopsis:  main(void)
*
* Description:  Main driver of the program.  Consists of a loop that
*               through each iteration:
* 		    	1.  Reads in the sentences
*			2.  Calls PrintVerb() to print the verb phrase for 
*                           each sentence.
*			3.  If another sentence list exists, continue.
*			4.  If another sentence list does not exist,
*              	            break out of the loop and exit.
*
* Return Value:  Exit 0 if success, exit 1 if error was encountered.
***************************************************************************/
main()
{
  int sentenceIndex;

  /* 
   * Attempt to read in the first set of sentences from input.
   */
  ReadSentences();

  /* 
   * WHILE we have sentences on our sentence list, print their verb phrases.
   */
  while(strcmp(Sentences[0], "\0")) {
      for(sentenceIndex = 0; sentenceIndex < NUM_SENTENCES; sentenceIndex++) {
          PrintVerb(Sentences[sentenceIndex], sentenceIndex);
      }

      printf("\n");

      /* 
       * Attempt to read in another set of sentences from input.
       */
      ReadSentences();
  }

  exit(0);
}

